"""Commit changes deploy: upload auth fix and rebuild app."""
import os
import sys
import tarfile
import tempfile
from pathlib import Path
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
remote = "/home/user_adm/ekonomiya"
root = Path(__file__).resolve().parents[1]

files = [
    "src/lib/auth.ts",
    "src/lib/public-url.ts",
    "src/app/api/auth/login/route.ts",
    "src/app/login/page.tsx",
    "src/middleware.ts",
    "docker-compose.prod.yml",
    "deploy/nginx-ekonomiya-ip.conf",
    ".env.example",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=60)

tmp = tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False)
tmp.close()
arc = Path(tmp.name)
with tarfile.open(arc, "w:gz") as tar:
    for f in files:
        tar.add(root / f, arcname=f.replace("\\", "/"))
sftp = c.open_sftp()
sftp.put(str(arc), f"{remote}/patch.tar.gz")
sftp.close()
arc.unlink(missing_ok=True)

# patch .env COOKIE_SECURE
patch_env = (
    f"cd {remote} && "
    f"(grep -q '^COOKIE_SECURE=' .env || echo 'COOKIE_SECURE=false' >> .env) && "
    f"sed -i 's/^COOKIE_SECURE=.*/COOKIE_SECURE=false/' .env && "
    f"(grep -q '^APP_URL=' .env || echo 'APP_URL=http://178.170.165.78' >> .env) && "
    f"sed -i 's|^APP_URL=.*|APP_URL=http://178.170.165.78|' .env"
)

sudo = f"echo '{pw}' | sudo -S"
for cmd in [
    f"cd {remote} && tar -xzf patch.tar.gz && rm patch.tar.gz",
    patch_env,
    f"{sudo} cp {remote}/deploy/nginx-ekonomiya-ip.conf /etc/nginx/sites-available/ekonomiya-ip",
    f"{sudo} nginx -t && {sudo} systemctl reload nginx",
    f"{sudo} bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya up -d --build --force-recreate app'",
    "sleep 15",
    "curl -s -c /tmp/ekoc.jar -b /tmp/ekoc.jar -X POST -d 'password=513277&from=/' -o /dev/null -w 'login:%{http_code}' http://127.0.0.1:3010/api/auth/login",
    "curl -s -b /tmp/ekoc.jar -o /dev/null -w ' home:%{http_code}' http://127.0.0.1:3010/",
]:
    sys.stdout.buffer.write(f"\n$ {cmd}\n".encode())
    _, o, _ = c.exec_command(cmd, timeout=600)
    sys.stdout.buffer.write(o.read())
c.close()
print("\nDone: http://178.170.165.78/")

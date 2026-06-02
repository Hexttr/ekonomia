import os, sys, tarfile, tempfile
from pathlib import Path
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
remote = "/home/user_adm/ekonomiya"
root = Path(__file__).resolve().parents[1]
files = [
    "src/lib/auth.ts",
    "src/lib/session-token.ts",
    "src/lib/attach-session.ts",
    "src/lib/public-url.ts",
    "src/middleware.ts",
    "src/app/api/auth/login/route.ts",
    "src/app/api/auth/restore/route.ts",
    "src/app/login/page.tsx",
    "src/app/layout.tsx",
    "src/components/SessionSync.tsx",
    "src/components/LoginRestore.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=60)
arc = Path(tempfile.mktemp(suffix=".tar.gz"))
with tarfile.open(arc, "w:gz") as tar:
    for f in files:
        tar.add(root / f, arcname=f)
sftp = c.open_sftp()
sftp.put(str(arc), f"{remote}/patch.tar.gz")
sftp.close()
arc.unlink(missing_ok=True)
sudo = f"echo '{pw}' | sudo -S"
for cmd in [
    f"cd {remote} && tar -xzf patch.tar.gz && rm patch.tar.gz",
    f"{sudo} bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya up -d --build --force-recreate app'",
]:
    sys.stdout.buffer.write(f"\n$ {cmd}\n".encode())
    _, o, _ = c.exec_command(cmd, timeout=600)
    sys.stdout.buffer.write(o.read())
c.close()
print("Done")

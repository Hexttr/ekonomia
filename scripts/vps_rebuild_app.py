import os
import sys
import tarfile
import tempfile
from pathlib import Path
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
remote = "/home/user_adm/ekonomiya"
root = Path(__file__).resolve().parents[1]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=60)

tmp = tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False)
tmp.close()
arc = Path(tmp.name)
with tarfile.open(arc, "w:gz") as tar:
    for f in ["src/app/login/page.tsx", "Dockerfile", "src/app/(app)/layout.tsx"]:
        tar.add(root / f, arcname=f.replace("\\", "/"))

sftp = c.open_sftp()
sftp.put(str(arc), f"{remote}/patch.tar.gz")
sftp.close()
arc.unlink(missing_ok=True)

sudo = f"echo '{pw}' | sudo -S"
cmds = [
    f"cd {remote} && tar -xzf patch.tar.gz",
    f"{sudo} bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya up -d --build --force-recreate app'",
    "sleep 20",
    "curl -sI http://127.0.0.1:3010/login | head -6",
    "curl -s -o /dev/null -w 'login_body:%{http_code}' http://127.0.0.1:3010/login",
]
for cmd in cmds:
    sys.stdout.buffer.write(f"\n$ {cmd}\n".encode())
    _, o, _ = c.exec_command(cmd, timeout=600)
    sys.stdout.buffer.write(o.read())
c.close()

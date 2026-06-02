import os
import sys
from pathlib import Path
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
remote = "/home/user_adm/ekonomiya"
root = Path(__file__).resolve().parents[1]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=60)

sftp = c.open_sftp()
for name in ["docker-compose.prod.yml", "Dockerfile", "src/app/(app)/layout.tsx"]:
    local = root / name
    remote_path = f"{remote}/{name}".replace("\\", "/")
    if "/" in name:
        pass
    sftp.put(str(local), remote_path)
    print("uploaded", name)
sftp.close()

cmds = [
    f"echo '{pw}' | sudo -S bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya down'",
    f"echo '{pw}' | sudo -S bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya up -d --build --force-recreate'",
    "sleep 25",
    f"echo '{pw}' | sudo -S docker port ekonomiya-mysql-1",
    f"echo '{pw}' | sudo -S docker inspect ekonomiya-app-1 --format '{{{{.Config.Cmd}}}}'",
    f"cd {remote} && set -a && . ./.env && set +a && DATABASE_URL=mysql://${{MYSQL_USER}}:${{MYSQL_PASSWORD}}@127.0.0.1:3307/ekonomiya npx --yes prisma@6.19.3 db push --schema=prisma/schema.prisma",
    "curl -s -o /dev/null -w 'http:%{http_code}' http://127.0.0.1:3010/login",
]
for cmd in cmds:
    sys.stdout.buffer.write(f"$ {cmd}\n".encode())
    _, o, _ = c.exec_command(cmd, timeout=600)
    sys.stdout.buffer.write(o.read())
c.close()

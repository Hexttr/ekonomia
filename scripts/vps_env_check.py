import os
import sys
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=30)

cmds = [
    "cat /home/user_adm/ekonomiya/.env | grep -v PASSWORD",
    f"echo '{pw}' | sudo -S docker exec ekonomiya-app-1 printenv ACCESS_PASSWORD DATABASE_URL 2>&1",
    "curl -sI http://127.0.0.1:3010/login | head -5",
    "curl -sI http://127.0.0.1:3010/ | head -5",
]
for cmd in cmds:
    sys.stdout.buffer.write(f"\n$ {cmd}\n".encode())
    _, o, _ = c.exec_command(cmd)
    sys.stdout.buffer.write(o.read())
c.close()

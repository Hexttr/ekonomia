import os, paramiko
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=os.environ["DEPLOY_SSH_PASS"], timeout=30)
pw = os.environ["DEPLOY_SSH_PASS"]
for cmd in [
    "docker ps -a --filter name=ekonomiya",
    f"echo '{pw}' | sudo -S docker ps -a --filter name=ekonomiya 2>/dev/null",
    "curl -s -o /dev/null -w 'http_code:%{http_code}' http://127.0.0.1:3010/login || true",
    "ss -tln | grep 3010 || true",
    f"echo '{pw}' | sudo -S docker logs ekonomiya-app-1 --tail 30 2>&1",
]:
    _, o, _ = c.exec_command(cmd)
    print(o.read().decode())
c.close()

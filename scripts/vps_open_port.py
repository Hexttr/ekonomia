import os
import sys
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=30)

cmds = [
    "curl -s -o /dev/null -w 'local:%{http_code}' http://127.0.0.1:3010/login",
    "curl -s -o /dev/null -w 'public:%{http_code}' --connect-timeout 5 http://178.170.165.78:3010/login",
    f"echo '{pw}' | sudo -S iptables -L INPUT -n 2>&1 | head -15",
    f"echo '{pw}' | sudo -S docker ps --filter name=ekonomiya",
]
for cmd in cmds:
    sys.stdout.buffer.write(f"$ {cmd}\n".encode())
    _, o, _ = c.exec_command(cmd)
    sys.stdout.buffer.write(o.read())
c.close()

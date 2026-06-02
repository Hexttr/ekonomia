import os
import sys
import paramiko

pw = os.environ.get("DEPLOY_SSH_PASS", "h_Irb60MaJGO")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=30)

cmds = [
    f"echo '{pw}' | sudo -S docker ps -a --filter name=ekonomiya",
    "ss -tln | grep -E '3010|3000'",
    "curl -s -o /dev/null -w 'local:%{http_code}' --max-time 5 http://127.0.0.1:3010/",
    "curl -s -o /dev/null -w 'public:%{http_code}' --max-time 5 http://178.170.165.78:3010/",
    f"echo '{pw}' | sudo -S docker logs ekonomiya-app-1 --tail 25 2>&1",
    f"echo '{pw}' | sudo -S iptables -L -n 2>&1 | head -25",
    f"echo '{pw}' | sudo -S nft list ruleset 2>&1 | head -20 || true",
]
for cmd in cmds:
    sys.stdout.buffer.write(f"\n$ {cmd}\n".encode())
    _, o, e = c.exec_command(cmd, timeout=60)
    sys.stdout.buffer.write(o.read())
    err = e.read()
    if err:
        sys.stdout.buffer.write(err)
c.close()

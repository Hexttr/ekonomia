import os
import sys
import paramiko

pw = os.environ.get("DEPLOY_SSH_PASS", "h_Irb60MaJGO")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=30)

def run(cmd, t=30):
    sys.stdout.buffer.write(f"\n=== {cmd[:100]} ===\n".encode())
    _, o, e = c.exec_command(cmd, timeout=t)
    out = o.read().decode("utf-8", errors="replace")
    err = e.read().decode("utf-8", errors="replace")
    sys.stdout.buffer.write((out + err).encode("utf-8", errors="replace"))

run(f"echo '{pw}' | sudo -S docker ps --filter name=ekonomiya")
run("curl -sI --max-time 5 http://127.0.0.1:3010/ | head -8")
run("curl -sI --max-time 5 -H 'Host: 178.170.165.78' http://127.0.0.1/ | head -8")
run("curl -sI --max-time 5 http://178.170.165.78/ | head -8")
run(f"echo '{pw}' | sudo -S systemctl is-active nginx")
run(f"echo '{pw}' | sudo -S nginx -T 2>&1 | grep -E 'server_name|listen 80|default_server' | head -30")
run(f"echo '{pw}' | sudo -S cat /etc/nginx/sites-available/ekonomiya-ip")
run("ss -tln | grep ':80 '")
c.close()

import os
import sys
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=30)

def run(cmd):
    sys.stdout.buffer.write(f"\n$ {cmd}\n".encode())
    _, o, e = c.exec_command(cmd, timeout=30)
    out = o.read()
    err = e.read()
    sys.stdout.buffer.write(out or err)

run(f"echo '{pw}' | sudo -S ls -la /etc/nginx/sites-enabled/")
run(f"echo '{pw}' | sudo -S cat /etc/nginx/sites-available/ekonomiya-ip 2>&1")
run(f"echo '{pw}' | sudo -S nginx -T 2>&1 | grep -A2 'listen 80' | head -40")

nginx_conf = """server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 178.170.165.78 _;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
"""

sftp = c.open_sftp()
with sftp.file("/tmp/ekonomiya-ip.conf", "w") as f:
    f.write(nginx_conf)
sftp.close()

run(f"echo '{pw}' | sudo -S cp /tmp/ekonomiya-ip.conf /etc/nginx/sites-available/ekonomiya-ip")
run(f"echo '{pw}' | sudo -S nginx -t 2>&1")
run(f"echo '{pw}' | sudo -S systemctl reload nginx")
run("curl -s -o /dev/null -w 'ip80:%{http_code}' -H 'Host: 178.170.165.78' http://127.0.0.1/")
run("curl -s -o /dev/null -w 'ava:%{http_code}' -H 'Host: ava.nmiczd.ru' http://127.0.0.1/ 2>&1 | head -1")
c.close()

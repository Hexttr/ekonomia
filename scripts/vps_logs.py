import os, sys, paramiko
pw = os.environ["DEPLOY_SSH_PASS"]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=60)
cmds = [
    f"echo '{pw}' | sudo -S docker logs ekonomiya-app-1 --tail 80 2>&1",
    "curl -s -o /dev/null -w 'home:%{http_code}\\n' http://127.0.0.1:3010/",
    "curl -s -c /tmp/ek.jar -b /tmp/ek.jar -X POST -d 'password=513277&from=/' -w 'login:%{http_code}\\n' -o /dev/null http://127.0.0.1:3010/api/auth/login",
    "curl -s -b /tmp/ek.jar -w 'home_after:%{http_code}\\n' -o /tmp/home.html http://127.0.0.1:3010/",
    "head -c 500 /tmp/home.html",
]
for cmd in cmds:
    sys.stdout.buffer.write(f"\n$ {cmd}\n".encode())
    _, o, e = c.exec_command(cmd)
    sys.stdout.buffer.write(o.read())
    sys.stdout.buffer.write(e.read())
c.close()

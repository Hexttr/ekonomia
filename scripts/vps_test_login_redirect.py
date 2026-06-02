import os, sys, paramiko
pw = os.environ["DEPLOY_SSH_PASS"]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=30)
cmd = (
    "curl -s -D - -o /dev/null -X POST "
    "-d 'password=513277&from=/' "
    "-H 'Host: 178.170.165.78' "
    "http://127.0.0.1:3010/api/auth/login | grep -iE 'HTTP|^[Ll]ocation'"
)
_, o, _ = c.exec_command(cmd)
sys.stdout.buffer.write(o.read())
c.close()

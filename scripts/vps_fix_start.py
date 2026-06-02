import os
import sys
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
remote = "/home/user_adm/ekonomiya"
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=60)

def run(cmd: str, t: int = 600) -> None:
    sys.stdout.buffer.write(f"$ {cmd}\n".encode())
    _, o, e = c.exec_command(cmd, timeout=t)
    sys.stdout.buffer.write(o.read())
    err = e.read()
    if err:
        sys.stdout.buffer.write(err)

run(f"echo '{pw}' | sudo -S bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya down'")
run(f"echo '{pw}' | sudo -S bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya up -d --build'")
run("sleep 25")
run(
    f"cd {remote} && set -a && . ./.env && set +a && "
    "DATABASE_URL=mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@127.0.0.1:3307/ekonomiya "
    "npx --yes prisma@6.19.3 db push --schema=prisma/schema.prisma"
)
run("sleep 5 && curl -s -o /dev/null -w 'http:%{http_code}' http://127.0.0.1:3010/login")
run(f"echo '{pw}' | sudo -S docker inspect ekonomiya-app-1 --format '{{{{.Config.Cmd}}}}'")
run(f"echo '{pw}' | sudo -S docker logs ekonomiya-app-1 --tail 20 2>&1")
c.close()

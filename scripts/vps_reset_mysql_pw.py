"""Reset MySQL passwords to match .env via skip-grant-tables (keeps data)."""
import os
import re
import sys
import time
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
remote = "/home/user_adm/ekonomiya"
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=60)
sudo = f"echo '{pw}' | sudo -S"


def run(cmd: str, timeout: int = 180) -> str:
    sys.stdout.buffer.write(f"\n$ {cmd[:240]}\n".encode())
    _, o, e = c.exec_command(cmd, timeout=timeout)
    out = o.read() + e.read()
    sys.stdout.buffer.write(out)
    return out.decode("utf-8", errors="replace")


env_text = run(f"cat {remote}/.env")
env = {}
for line in env_text.splitlines():
    m = re.match(r"^([A-Z_]+)=(.*)$", line.strip())
    if m:
        env[m.group(1)] = m.group(2)

user = env.get("MYSQL_USER", "ekonomiya")
db_pass = env["MYSQL_PASSWORD"]
root_pass = env["MYSQL_ROOT_PASSWORD"]

# escape for SQL single quotes
def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "''")

db_esc = esc(db_pass)
root_esc = esc(root_pass)

run(
    f"{sudo} bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya stop app mysql'"
)

vol = run(f"{sudo} docker volume ls -q | grep ekonomiya_mysql").strip().splitlines()
vol_name = vol[0] if vol else "ekonomiya_ekonomiya_mysql"
print(f"Volume: {vol_name}")

run(f"{sudo} docker rm -f mysql-reset 2>/dev/null || true")
run(
    f"{sudo} docker run -d --name mysql-reset "
    f"-v {vol_name}:/var/lib/mysql "
    f"mysql:8.4 mysqld --skip-grant-tables --skip-networking"
)
time.sleep(12)

sql = (
    "FLUSH PRIVILEGES;"
    f"ALTER USER 'root'@'localhost' IDENTIFIED BY '{root_esc}';"
    f"CREATE USER IF NOT EXISTS '{user}'@'%' IDENTIFIED BY '{db_esc}';"
    f"CREATE USER IF NOT EXISTS '{user}'@'localhost' IDENTIFIED BY '{db_esc}';"
    f"ALTER USER '{user}'@'%' IDENTIFIED BY '{db_esc}';"
    f"ALTER USER '{user}'@'localhost' IDENTIFIED BY '{db_esc}';"
    f"GRANT ALL PRIVILEGES ON ekonomiya.* TO '{user}'@'%';"
    f"GRANT ALL PRIVILEGES ON ekonomiya.* TO '{user}'@'localhost';"
    "FLUSH PRIVILEGES;"
)
run(f'{sudo} docker exec mysql-reset mysql -uroot -e "{sql}"')

run(f"{sudo} docker rm -f mysql-reset")
run(
    f"{sudo} bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya up -d'"
)
time.sleep(15)

test = (
    f"{sudo} docker exec ekonomiya-mysql-1 mysql -u{user} -p'{db_pass}' "
    f"-e 'SELECT COUNT(*) AS categories FROM categories' ekonomiya 2>&1"
)
run(test)
run(
    "curl -s -c /tmp/ek3.jar -b /tmp/ek3.jar -X POST -d 'password=513277&from=/' "
    "-o /dev/null -w 'login:%{http_code} ' http://127.0.0.1:3010/api/auth/login"
)
run(
    "curl -s -b /tmp/ek3.jar http://127.0.0.1:3010/ 2>&1 | "
    "grep -o 'Application error' || echo 'OK: no application error in HTML'"
)
c.close()

"""Fix MySQL password mismatch after deploy overwrote .env."""
import os
import re
import sys
import paramiko

pw = os.environ["DEPLOY_SSH_PASS"]
remote = "/home/user_adm/ekonomiya"
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("178.170.165.78", username="user_adm", password=pw, timeout=60)
sudo = f"echo '{pw}' | sudo -S"


def run(cmd: str) -> str:
    sys.stdout.buffer.write(f"\n$ {cmd[:200]}\n".encode())
    _, o, e = c.exec_command(cmd, timeout=120)
    out = o.read() + e.read()
    sys.stdout.buffer.write(out)
    return out.decode("utf-8", errors="replace")


# Read current .env
env_text = run(f"cat {remote}/.env")
env = {}
for line in env_text.splitlines():
    m = re.match(r"^([A-Z_]+)=(.*)$", line.strip())
    if m:
        env[m.group(1)] = m.group(2)

user = env.get("MYSQL_USER", "ekonomiya")
db_pass = env.get("MYSQL_PASSWORD", "")
root_pass = env.get("MYSQL_ROOT_PASSWORD", "")

# Test app DB URL
run(f"{sudo} docker exec ekonomiya-app-1 printenv DATABASE_URL 2>&1")

# Test login as app user
test = (
    f"{sudo} docker exec ekonomiya-mysql-1 mysql -u{user} -p'{db_pass}' "
    f"-e 'SELECT 1 AS ok' ekonomiya 2>&1"
)
out = run(test)
if "ok" in out and "ERROR" not in out:
    print("\nDB credentials OK — restarting app")
    run(f"{sudo} bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya restart app'")
    c.close()
    sys.exit(0)

print("\nPassword mismatch — resetting MySQL user to match .env")

# Try root with current env password
root_test = (
    f"{sudo} docker exec ekonomiya-mysql-1 mysql -uroot -p'{root_pass}' "
    "-e \"SELECT 1\" 2>&1"
)
root_out = run(root_test)

if "ERROR" in root_out or "Access denied" in root_out:
    print("Root with .env password failed — try socket / old patterns")
    # MySQL 8 in Docker: local root sometimes works via socket without password in maintenance
    run(
        f"{sudo} docker exec ekonomiya-mysql-1 mysql -uroot -e "
        f"\"ALTER USER '{user}'@'%' IDENTIFIED BY '{db_pass}'; "
        f"ALTER USER '{user}'@'localhost' IDENTIFIED BY '{db_pass}'; "
        f"FLUSH PRIVILEGES;\" 2>&1"
    )
else:
    run(
        f"{sudo} docker exec ekonomiya-mysql-1 mysql -uroot -p'{root_pass}' -e "
        f"\"ALTER USER '{user}'@'%' IDENTIFIED BY '{db_pass}'; "
        f"ALTER USER '{user}'@'localhost' IDENTIFIED BY '{db_pass}'; "
        f"FLUSH PRIVILEGES;\" 2>&1"
    )

run(test)
run(f"{sudo} bash -lc 'cd {remote} && docker compose -f docker-compose.prod.yml -p ekonomiya restart app'")
run("sleep 5")
run(
    "curl -s -c /tmp/ek2.jar -b /tmp/ek2.jar -X POST -d 'password=513277&from=/' "
    "-o /dev/null -w 'login:%{http_code} ' http://127.0.0.1:3010/api/auth/login"
)
run("curl -s -b /tmp/ek2.jar -o /dev/null -w 'home:%{http_code}' http://127.0.0.1:3010/")
c.close()
print("\nDone")

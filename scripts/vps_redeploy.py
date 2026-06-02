"""Quick redeploy: upload key files and rebuild containers."""
import os
import sys
import tarfile
import tempfile
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parents[1]
REMOTE = "/home/user_adm/ekonomiya"
FILES = [
    "Dockerfile",
    "docker-compose.prod.yml",
    "src/app/(app)/layout.tsx",
]


def main() -> None:
    pw = os.environ.get("DEPLOY_SSH_PASS")
    if not pw:
        sys.exit("Set DEPLOY_SSH_PASS")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("178.170.165.78", username="user_adm", password=pw, timeout=60)

    tmp = tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False)
    tmp.close()
    arc = Path(tmp.name)
    with tarfile.open(arc, "w:gz") as tar:
        for f in FILES:
            p = ROOT / f
            tar.add(p, arcname=f.replace("\\", "/"))

    sftp = client.open_sftp()
    sftp.put(str(arc), f"{REMOTE}/patch.tar.gz")
    sftp.close()
    arc.unlink(missing_ok=True)

    sudo = f"echo '{pw}' | sudo -S"
    cmds = [
        f"cd {REMOTE} && tar -xzf patch.tar.gz && rm patch.tar.gz",
        f"{sudo} bash -lc 'cd {REMOTE} && docker compose -f docker-compose.prod.yml -p ekonomiya up -d --build'",
        "sleep 15",
        "curl -s -o /dev/null -w 'http:%{http_code}' http://127.0.0.1:3010/login",
        f"{sudo} docker ps --filter name=ekonomiya",
        f"{sudo} docker logs ekonomiya-app-1 --tail 15 2>&1",
    ]
    for cmd in cmds:
        print("$", cmd)
        _, o, e = client.exec_command(cmd)
        out = o.read().decode("utf-8", errors="replace")
        sys.stdout.buffer.write(out.encode("utf-8", errors="replace"))
        err = e.read().decode("utf-8", errors="replace")
        if err.strip():
            sys.stdout.buffer.write(err.encode("utf-8", errors="replace"))
    client.close()


if __name__ == "__main__":
    main()

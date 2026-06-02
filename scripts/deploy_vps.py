#!/usr/bin/env python3
"""Deploy ekonomiya to VPS via Paramiko (SFTP + SSH)."""
from __future__ import annotations

import os
import secrets
import sys
import tarfile
import tempfile
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parents[1]
REMOTE_DIR = "/home/user_adm/ekonomiya"
APP_PORT = int(os.environ.get("APP_PORT", "3010"))

SKIP_DIRS = {"node_modules", ".next", ".git", "legacy", "terminals"}
SKIP_FILES = {".env", ".env.local"}


def connect() -> paramiko.SSHClient:
    password = os.environ.get("DEPLOY_SSH_PASS")
    if not password:
        print("Set DEPLOY_SSH_PASS", file=sys.stderr)
        sys.exit(1)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        os.environ.get("DEPLOY_HOST", "178.170.165.78"),
        username=os.environ.get("DEPLOY_USER", "user_adm"),
        password=password,
        timeout=60,
    )
    return client


def run(client: paramiko.SSHClient, cmd: str, check: bool = True, sudo: bool = False) -> int:
    password = os.environ.get("DEPLOY_SSH_PASS", "")
    if sudo:
        cmd = f"echo '{password}' | sudo -S bash -lc {repr(cmd)}"
    print(f"$ {cmd[:120]}{'...' if len(cmd) > 120 else ''}")
    _, stdout, stderr = client.exec_command(cmd, get_pty=True)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    code = stdout.channel.recv_exit_status()
    def safe_print(text: str) -> None:
        sys.stdout.buffer.write((text + "\n").encode("utf-8", errors="replace"))

    if out.strip():
        safe_print(out.rstrip())
    if err.strip() and "password for" not in err.lower():
        safe_print(err.rstrip())
    if check and code != 0:
        raise RuntimeError(f"Failed ({code}): {cmd[:80]}")
    return code


def probe(client: paramiko.SSHClient) -> None:
    print("\n=== Probe ===")
    run(client, "hostname; node -v; ss -tln | grep -E ':80|:443|:3000|:3010' || true", check=False)


def ensure_docker(client: paramiko.SSHClient) -> None:
    print("\n=== Docker ===")
    if run(client, "docker --version", check=False) == 0:
        return
    print("Installing Docker (does not touch port 3000 / existing nginx app)...")
    run(
        client,
        "apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker.io docker-compose-v2",
        sudo=True,
    )
    run(client, "systemctl enable --now docker", sudo=True)
    run(client, "usermod -aG docker user_adm", sudo=True)


def make_archive() -> Path:
    tmp = tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False)
    tmp.close()
    archive = Path(tmp.name)
    with tarfile.open(archive, "w:gz") as tar:
        for path in ROOT.rglob("*"):
            rel = path.relative_to(ROOT)
            if rel.parts and rel.parts[0] in SKIP_DIRS:
                continue
            if any(p in SKIP_DIRS for p in rel.parts):
                continue
            if path.name in SKIP_FILES:
                continue
            if path.is_file():
                tar.add(path, arcname=str(rel).replace("\\", "/"))
    print(f"Archive {archive.stat().st_size // 1024} KB")
    return archive


def upload(client: paramiko.SSHClient, archive: Path) -> None:
    print(f"\n=== Upload -> {REMOTE_DIR} ===")
    run(client, f"mkdir -p {REMOTE_DIR}")
    sftp = client.open_sftp()
    sftp.put(str(archive), f"{REMOTE_DIR}/release.tar.gz")
    sftp.close()
    run(client, f"cd {REMOTE_DIR} && tar -xzf release.tar.gz && rm -f release.tar.gz")


def _read_remote_env(client: paramiko.SSHClient) -> dict[str, str]:
    try:
        sftp = client.open_sftp()
        with sftp.file(f"{REMOTE_DIR}/.env", "r") as f:
            text = f.read().decode("utf-8", errors="replace")
        sftp.close()
    except OSError:
        return {}
    out: dict[str, str] = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        out[key.strip()] = val.strip()
    return out


def write_env(client: paramiko.SSHClient) -> None:
    existing = _read_remote_env(client)
    mysql_root = existing.get("MYSQL_ROOT_PASSWORD") or secrets.token_urlsafe(24)
    mysql_pass = existing.get("MYSQL_PASSWORD") or secrets.token_urlsafe(20)
    if existing.get("MYSQL_ROOT_PASSWORD"):
        print(".env: keeping existing MySQL passwords")
    else:
        print(".env: creating new MySQL passwords")
    env = f"""MYSQL_ROOT_PASSWORD={mysql_root}
MYSQL_USER=ekonomiya
MYSQL_PASSWORD={mysql_pass}
ACCESS_PASSWORD={existing.get('ACCESS_PASSWORD') or os.environ.get('ACCESS_PASSWORD', '513277')}
COOKIE_SECURE={existing.get('COOKIE_SECURE', 'false')}
APP_URL={existing.get('APP_URL', 'http://178.170.165.78')}
APP_PORT={APP_PORT}
"""
    sftp = client.open_sftp()
    with sftp.file(f"{REMOTE_DIR}/.env", "w") as f:
        f.write(env)
    sftp.close()
    print(f".env written (port {APP_PORT})")


def deploy_stack(client: paramiko.SSHClient) -> None:
    print("\n=== Build & start (project ekonomiya, port 3010) ===")
    compose = f"cd {REMOTE_DIR} && docker compose -f docker-compose.prod.yml -p ekonomiya up -d --build"
    password = os.environ.get("DEPLOY_SSH_PASS", "")
    if run(client, compose, check=False) != 0:
        run(client, f"echo '{password}' | sudo -S bash -lc {repr(compose)}", sudo=False)

    migrate = (
        f"cd {REMOTE_DIR} && set -a && . ./.env && set +a && "
        f"DATABASE_URL=mysql://${{MYSQL_USER}}:${{MYSQL_PASSWORD}}@127.0.0.1:3307/ekonomiya "
        f"npx --yes prisma@6.19.3 db push --schema=prisma/schema.prisma"
    )
    print("\n=== DB schema (host npx prisma) ===")
    run(client, migrate, check=False)


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "deploy"
    client = connect()
    try:
        probe(client)
        if mode == "probe":
            return
        ensure_docker(client)
        archive = make_archive()
        try:
            upload(client, archive)
            write_env(client)
            deploy_stack(client)
            host = os.environ.get("DEPLOY_HOST", "178.170.165.78")
            print(f"\nOK http://{host}:{APP_PORT}")
            print("  Login password: ACCESS_PASSWORD from .env on server")
            print("  PWA + install: needs HTTPS (domain + nginx + certbot)")
        finally:
            archive.unlink(missing_ok=True)
    finally:
        client.close()


if __name__ == "__main__":
    main()

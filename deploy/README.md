# Deploying bruchner.dev

CI builds the site and rsyncs `dist/` to the VPS. The edge Caddy on the VPS serves it
and owns TLS, headers and redirects. The Caddy config in this folder is applied
**by hand**: CI can only write static files into one directory.

| File | Purpose |
|---|---|
| `security-headers.caddy` | CSP, HSTS and the other response headers (snippet `bruchner_dev_headers`) |
| `bruchner.dev.caddy` | Site blocks: `bruchner.dev`, the `www` and `phhbr.de` redirects, old-URL redirects, caching, 404 |
| `test-caddy.sh` | Runs both files in a Caddy container against `./dist` and checks everything (also runs in CI) |

## Deploying and rolling back

- **Deploy:** push to `main`. The workflow builds, tests, uploads, and then checks that
  `https://bruchner.dev/version.txt` shows the new commit.
- **Roll back:** Actions → Deploy → Run workflow, with an earlier commit as `ref`.

## Updating the Caddy config

Whenever `deploy/*.caddy` changes: run `./deploy/test-caddy.sh`, commit, then copy the
files to the server and reload. The server has no clone of this repo.

```bash
# Locally, from the repo root:
scp deploy/security-headers.caddy deploy/bruchner.dev.caddy <you>@<vps>:/tmp/

# On the server:
sudo mv /tmp/security-headers.caddy /tmp/bruchner.dev.caddy /etc/caddy/sites/
sudo chown root:root /etc/caddy/sites/*.caddy
sudo caddy validate --config /etc/caddy/Caddyfile && sudo systemctl reload caddy
```

Don't add a `log` directive: the privacy policy says the site keeps no access logs.

## Setting up a server from scratch

The commands assume Debian or Ubuntu with Caddy installed from its package.

### Deploy user and directory

The `deploy` user has no password and no sudo, and is not in the `docker` group.
It needs a real shell only because sshd runs the forced command through it.

```bash
sudo apt install rsync            # provides /usr/bin/rrsync (rsync 3.2.4+)
sudo useradd --create-home --shell /bin/sh deploy
sudo passwd --lock deploy
sudo install -d -o deploy -g deploy -m 755 /srv/bruchner.dev/site
sudo install -d -o deploy -g deploy -m 700 /home/deploy/.ssh
```

### Deploy key

Create the key on your own machine, then allow it exactly one thing: rsync into the
site directory (`restrict` turns off forwarding, PTY and `~/.ssh/rc`). Run this
**locally**, so `$(cat …)` reads the local `.pub` file; run on the server, it writes an
empty key and sshd falls back to password auth.

```bash
ssh-keygen -t ed25519 -N '' -C 'github-actions deploy bruchner.dev' -f bruchner-dev-deploy

ssh -t <you>@<vps> "echo 'command=\"rrsync /srv/bruchner.dev/site\",restrict $(cat bruchner-dev-deploy.pub)' \
  | sudo tee /home/deploy/.ssh/authorized_keys > /dev/null \
  && sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys \
  && sudo chmod 600 /home/deploy/.ssh/authorized_keys"
```

Check it. The first command must be refused (no shell), the second must list the directory:

```bash
ssh -i bruchner-dev-deploy deploy@<vps> id
rsync -e "ssh -i bruchner-dev-deploy" deploy@<vps>:
```

On macOS, `/usr/bin/rsync` is Apple's `openrsync`, which `rrsync` rejects with "invalid
rsync-command syntax". Use GNU rsync for the check (`brew install rsync`, then
`$(brew --prefix rsync)/bin/rsync …`). The GitHub Actions runner already has GNU rsync.

### Caddy

Copy the files as in *Updating the Caddy config* (after `sudo install -d /etc/caddy/sites`),
then add one line to `/etc/caddy/Caddyfile`, after any global options block, and reload:

```caddy
import sites/bruchner.dev.caddy
```

If Caddy runs in a container, mount `/srv/bruchner.dev/site` into it read-only at the same path.

### GitHub environment and secrets

The deploy job uses the `production` environment, which only `main` may deploy to:

```bash
REPO=phhbr/bruchner.dev
gh api -X PUT repos/$REPO/environments/production --input - <<'JSON'
{"deployment_branch_policy": {"protected_branches": false, "custom_branch_policies": true}}
JSON
gh api -X POST repos/$REPO/environments/production/deployment-branch-policies -f name=main
```

Pin the host key. Compare what `ssh-keyscan` returns with the fingerprint shown **on the
server** (`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`) before trusting it:

```bash
ssh-keyscan -t ed25519 <vps> > known_hosts
ssh-keygen -lf known_hosts

gh secret set VPS_HOST --env production --repo $REPO --body '<vps>'
gh secret set VPS_SSH_KEY --env production --repo $REPO < bruchner-dev-deploy
gh secret set VPS_SSH_KNOWN_HOSTS --env production --repo $REPO < known_hosts
rm bruchner-dev-deploy bruchner-dev-deploy.pub known_hosts   # the private key now lives only in GitHub
```

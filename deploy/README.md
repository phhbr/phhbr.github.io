# Deploying bruchner.dev

CI builds the site and rsyncs `dist/` to the VPS. The existing edge Caddy serves it
and owns TLS, headers and redirects. The Caddy config in this folder is applied
**by hand**: CI can only write static files into one directory.

| File | Purpose |
|---|---|
| `security-headers.caddy` | CSP, HSTS and the other response headers (snippet `bruchner_dev_headers`) |
| `bruchner.dev.caddy` | Site blocks: `bruchner.dev`, `www` redirect, legacy URL redirects, caching, 404 |
| `test-caddy.sh` | Runs both files in a Caddy container against `./dist` and checks everything (also runs in CI) |

The commands below assume Debian or Ubuntu with Caddy installed from its package.

## 1. Deploy user and directory (plan 0.3)

The `deploy` user has no password and no sudo, and is not in the `docker` group.
It needs a real shell only because sshd runs the forced command through it.

```bash
sudo apt install rsync            # provides /usr/bin/rrsync (rsync 3.2.4+)
sudo useradd --create-home --shell /bin/sh deploy
sudo passwd --lock deploy
sudo install -d -o deploy -g deploy -m 755 /srv/bruchner.dev/site
```

## 2. Deploy key (plan 0.4)

Create the key on your own machine, not on the server:

```bash
ssh-keygen -t ed25519 -N '' -C 'github-actions deploy bruchner.dev' -f bruchner-dev-deploy
```

On the server, allow it to do exactly one thing, rsync into the site directory
(`restrict` turns off forwarding, PTY and `~/.ssh/rc`):

```bash
sudo install -d -o deploy -g deploy -m 700 /home/deploy/.ssh
echo "command=\"rrsync /srv/bruchner.dev/site\",restrict $(cat bruchner-dev-deploy.pub)" \
  | sudo tee /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Check it from your machine. The first command must fail (no shell), the second must list the directory:

```bash
ssh -i bruchner-dev-deploy deploy@<vps> id
rsync -e "ssh -i bruchner-dev-deploy" deploy@<vps>:
```

## 3. Caddy (plan 4.1)

```bash
sudo install -d /etc/caddy/sites
sudo cp deploy/security-headers.caddy deploy/bruchner.dev.caddy /etc/caddy/sites/
```

Add one line to `/etc/caddy/Caddyfile`, after any global options block:

```caddy
import sites/bruchner.dev.caddy
```

```bash
caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

If Caddy runs in a container, mount `/srv/bruchner.dev/site` into it read-only at the same path.

Don't add a `log` directive: the privacy policy says the site keeps no access logs.

## 4. GitHub environment and secrets (plan 4.2)

The deploy job uses the `production` environment. Only `main`, and the feature
branch until it is merged, may deploy to it:

```bash
REPO=phhbr/phhbr.github.io
gh api -X PUT repos/$REPO/environments/production --input - <<'JSON'
{"deployment_branch_policy": {"protected_branches": false, "custom_branch_policies": true}}
JSON
gh api -X POST repos/$REPO/environments/production/deployment-branch-policies -f name=main
gh api -X POST repos/$REPO/environments/production/deployment-branch-policies -f name=feat/astro-bruchner-dev
```

Pin the host key. Compare what `ssh-keyscan` returns with the fingerprint shown **on the
server** (`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`) before trusting it:

```bash
ssh-keyscan -t ed25519 <vps> > known_hosts
ssh-keygen -lf known_hosts
```

```bash
gh secret set VPS_HOST --env production --repo $REPO --body '<vps>'
gh secret set VPS_SSH_KEY --env production --repo $REPO < bruchner-dev-deploy
gh secret set VPS_SSH_KNOWN_HOSTS --env production --repo $REPO < known_hosts
rm bruchner-dev-deploy known_hosts   # the private key now lives only in GitHub
```

## Deploying and rolling back

- **Deploy:** push to `main` (and to the feature branch until 6.3). The workflow checks
  that `https://bruchner.dev/version.txt` shows the new commit.
- **Roll back:** Actions → Deploy → Run workflow, with an earlier commit as `ref`.
  This only works once `deploy.yml` is on the default branch.

## Launch switch (plan 5.2)

In `bruchner.dev.caddy`, change the `bruchner_dev_response_headers` snippet from
`Content-Security-Policy-Report-Only` to `Content-Security-Policy` and delete the
`X-Robots-Tag` line. Run `./deploy/test-caddy.sh`, commit, then copy the file to the
host, validate and reload.

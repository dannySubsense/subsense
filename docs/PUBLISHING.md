# Publishing Subsense

The site uses GitHub Pages. Editorial work can continue in small PRs; merging saves an accepted version, while publishing is a separate action. No hosting secret is stored in the repository. Deployment uses GitHub's short-lived workflow identity.

## Check a change

```sh
npm ci
npx playwright install chromium
npm run verify
```

Node 22 and Python 3 are required locally. On Linux CI, Playwright installs its browser dependencies with `--with-deps`.

`Validate site` runs on pull requests and pushes to `main`. It checks JavaScript syntax, content relationships, media references and provenance, and confirms the original corpus is untracked. It builds `dist/`, then tests that package under `/subsense/`, the GitHub project-site base path. Chromium checks 1440px desktop, 390px mobile and 320px narrow layouts, navigation, media, apparatus controls, keyboard access, reduced motion, and automated accessibility on Becoming Agential. Browser screenshots, failure traces and the HTML report are retained for 14 days. Automated checks supplement editorial and visual review.

The package includes an explicit list of browser files and only referenced media, plus `.nojekyll` and `version.json`. It excludes the original corpus, repository files, internal Markdown, tests, dependencies and unused media. Source-path strings attached to public content remain as provenance; they do not publish the referenced originals. New browser modules must be added to `scripts/build.mjs`. New media must be tracked and referenced in `site/content/archive.js`. Symlinks and untracked public files fail the build. The project package budget is 500 MiB; exceeding it requires a media-delivery review.

For a local preview after building:

```sh
npm run preview
```

Open `http://127.0.0.1:4173/`. The automated test server independently checks the hosted base path.

## Publish an accepted version

1. Review the PR's content, rendered result and `Site checks`; resolve failures and merge the authorized change.
2. Open GitHub **Actions → Publish site → Run workflow**, selecting **main**. Or run:

   ```sh
   gh workflow run publish.yml --repo dannySubsense/subsense --ref main
   ```

3. Follow the new run. It checks and rebuilds the exact revision captured at dispatch, then deploys that same artifact to the `github-pages` environment. Only `main` can enter deployment. Concurrent releases are serialized.
4. Confirm the run succeeds. Its summary records the public URL and commit. `version.json` on the live site must match that commit; the workflow polls for this after deployment.
5. Review the live entrance, Becoming Agential, sound, images and narrow-screen behavior before calling the editorial pass finished.

The intended canonical address is `https://subsense.art/`, configured as the GitHub Pages custom domain on 2026-11-08 after verifying the initial deployment at `https://dannySubsense.github.io/subsense/`. The GitHub-provided address redirects to the custom domain. Namecheap remains the registrar and DNS provider.

Namecheap website records (Automatic TTL):

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `dannysubsense.github.io` |

Preserve unrelated DNS and mail configuration, including MX, TXT/DKIM and `_autodiscover._tcp` SRV records. GitHub's custom-domain setting is managed through Pages settings/API; Actions deployments do not need a `CNAME` file in the artifact.

After DNS changes, inspect `gh api repos/dannySubsense/subsense/pages` for certificate readiness. Once ready, enable HTTPS enforcement with `gh api --method PUT repos/dannySubsense/subsense/pages -F https_enforced=true`. Verify HTTPS, HTTP-to-HTTPS and www-to-apex redirects, and the live `version.json`. DNS resolution alone does not prove certificate readiness. Run the browser suite against the custom domain with `SITE_URL=https://subsense.art/ npm test`.

GitHub's [custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) describes the artifact/deployment permissions used here. Actions are pinned to reviewed release commits; npm dependencies use `package-lock.json`.

## Recover a release

If validation fails, nothing is deployed. Fix the task branch and rerun the affected checks. If deployment or live revision verification fails, inspect Actions and the Pages environment first: deployment may have succeeded even if the final verification step failed.

To restore earlier content, open a revert PR on current `main`, verify it, merge with authority, and run `Publish site` again. Reverting code alone does not change the live site. This preserves the pipeline and shared history while recording the restoration as a new revision. The previous successful publishing run and its SHA identify the known-good content.

This pipeline does not automatically enable Copilot review or required branch checks. Configure those separately once desired; never report absent reviews as passing reviews.

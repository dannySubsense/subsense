# GitHub runbook — Danny and project agents

## The short version

An issue describes the work. A branch isolates it. A pull request makes it reviewable. A merge accepts it into the shared code. A deployment puts a particular version online.

```text
Issue or clear request
  → task branch → draft PR → tested, ready PR → review → merge to main
  → separately authorized deployment → live-site check
```

This is a recommended shared workflow, not a claim that every project already uses it. Start with short-lived branches and one main branch; no permanent development/staging branches or elaborate project board are needed. The pattern follows [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow). Project-specific exceptions should be explicit in that repository's agent instructions.

Danny directs the work and evaluates the result. Agents maintain the issues, branches, PR descriptions, evidence, and handoffs. GitHub should reduce coordination work, not become another job for Danny.

## 1. What each thing is for

| Item | Plain-language meaning | What it does not mean |
| --- | --- | --- |
| Repository | The project's tracked files and history | A deployment or backup of every local source asset |
| Issue | A task, bug, or decision that needs tracking | An instruction to implement every idea immediately |
| Branch | A separate line of changes for one task | A separate filesystem: agents sharing a checkout can still collide |
| Commit | A saved, named checkpoint | Uploaded or publicly deployed |
| Push | Upload commits to the remote branch | Merge them or necessarily publish the website |
| Pull request (PR) | A proposal to combine a branch into another branch | An accepted change; drafts are still work in progress |
| Review / checks | Feedback from people or AI / automated test results | Proof that the design is right or that all bugs are caught |
| Merge | Accept the proposed change into `main` | A deployment, unless the host is configured to deploy on merge |
| Deployment | Publish one exact code version to an environment | Merely creating a GitHub Release or tag |

Always inspect the project's deployment triggers. In some projects a push or merge really does publish immediately; never assume it is harmless because this runbook separates the concepts.

## 2. Where information belongs

- **Chat:** directions, discussion, quick feedback. Danny can speak naturally; the agent translates the request into tracked work when needed.
- **Issues:** work that spans sessions, has dependencies, needs another agent, or should remain in the backlog. Search before creating duplicates.
- **PRs:** the actual change, its scope, verification, preview, and review discussion.
- **Repository docs:** durable operating instructions and content workflows. Not command transcripts or daily journals.
- **Lore:** durable decisions, discoveries, and context with provenance. Link issues/PRs where relevant; do not maintain a second competing task board in memory.

A tiny correction does not require its own issue. Put related refinements in the existing task PR. A new feature, substantial bug, or handoff should have an issue. An issue can simply say:

```text
Outcome: what should be different for the user?
Done when: two or three observable conditions.
Scope: what is included, and any important exclusions.
Owner: agent name; links to source material or related work.
```

Example: “Keep navigation visible while scrolling; desktop and mobile; preserve the Index composition.” Not “redesign navigation, replace the router, and choose hosting.”

## 3. The normal working loop

1. **Orient and claim.** The agent reads repository instructions, relevant Lore, open issues/PRs, the current branch, and uncommitted changes. Identify one task owner. Do not reset or overwrite somebody else's work.
2. **Isolate.** Start from current `main` on a task branch such as `fix/42-sticky-navigation`, `feat/43-clean-urls`, or `docs/github-runbook`. Numbers are examples, not existing issues. Use the actual issue number when one exists.
3. **Make and save.** Implement within scope, make coherent commits, and push the task branch. Create a draft PR early enough that other agents can see the work. A draft is a shared work surface, not a request for Danny's approval at every step.
4. **Prove it.** Run relevant checks and inspect the rendered result. For Subsense: desktop/mobile, keyboard access, links, media/audio, source integrity, and performance proportional to the change. Record what actually ran and what remains untested.
5. **Make it reviewable.** Update the PR description and mark it ready for review. Once configured, that transition requests Copilot review. Include a working preview URL when available; screenshots are useful but do not prove interaction or audio works.
6. **Resolve feedback.** The implementing agent reads Copilot's findings, fixes valid issues, explains rejected suggestions, and reruns affected checks. Do not apply suggestions blindly or treat an absent/failed review as a pass. Push fixes to the same branch; the same PR updates.
7. **Accept.** Danny judges the authored experience and meaningful scope choices. The designated agent may merge when Danny has authorized that PR, or granted clear standing authority for that class of change. “Ready for review” is not permission to merge. Prefer squash merge for one coherent task, then clean up the merged branch after checking no agent still needs it.
8. **Publish separately.** For Subsense, recommend an explicitly triggered deployment of the accepted `main` revision. Record the deployed commit and verify the live URL. An authorized agent can do this; Danny need not operate the buttons personally.

An issue can close on merge if it means “implement this change.” If it means “make this live,” keep it open until deployment and verification. `Closes #42` in a PR targeting the default branch normally closes that issue on merge; use `Refs #42` for partial work or deployment-dependent completion. Automatic issue closing can be disabled in repository settings. [Issue linking](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), [auto-close setting](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-auto-closing-issues).

## 4. What Danny should receive

For meaningful work, ask for one compact handoff:

```text
PR: link and one-sentence change summary
Preview: URL, or exact local opening instructions
Checked: relevant tests and rendered behavior
Needs your judgment: only genuine creative/scope decisions, if any
State: draft / ready / merged; deployed or not; exact commit
```

You can say “make these changes,” “merge this PR, don't deploy,” or “merge and publish this version.” Those are different scopes. Do not turn every small implementation choice into a question. If you grant standing merge authority, name the scope and exclusions once in the repository instructions.

Where to look on GitHub:

- **Issues:** what is waiting or underway; the issue links to its working PR.
- **Pull requests → Conversation:** summary, review feedback, readiness, and merge status.
- **Pull requests → Files changed:** precisely what the agent changed.
- **Pull requests → Checks / Actions:** automated jobs and their failures. No checks configured is not “all tests passed.”
- **Actions / Deployments:** release runs and the version actually published, when configured.

GitHub Pages does not create a preview for every PR automatically. Local previews, hosted branch previews, and production are distinct. Never label a localhost URL as a public preview.

## 5. Copilot's job and the one-time setup

Use Copilot as an additional technical reviewer, not the creative director or release authority.

Recommended per-repository settings: under **Settings → Rulesets**, create an active branch ruleset targeting `main`, enable **Automatically request Copilot code review**, enable **Review new pushes**, and leave **Review draft pull requests** off. Review starts when an eligible PR opens ready, or first leaves draft; later pushes request further reviews. Danny does not need to request each review manually. [Configuration](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review), [review triggers](https://docs.github.com/en/copilot/concepts/agents/code-review#automatic-pull-request-reviews).

Keep Copilot auto-approval and auto-merge out of this initial setup. Automatic review is not automatic acceptance. Reviews consume Copilot allowance and can also consume Actions minutes; batch meaningful revisions rather than pushing a review-triggering commit for each keystroke. Inspect billing limits before enabling paid overages. [Review usage](https://docs.github.com/en/copilot/concepts/agents/code-review#code-review-usage).

Verify the setup with one real PR. Confirm a review appears, then confirm re-review after a follow-up push. Cloud agents may open PRs under different accounts/apps: check the PR author and eligibility instead of assuming every agent inherits Danny's subscription. Account-wide automatic review is also available, but a repository rule makes this project's expectation explicit.

## 6. Avoid the single-account approval trap

Agent names in chat are not separate GitHub identities. The local CLI currently acts as `dannySubsense`; a PR it opens is authored by that account. Danny cannot supply a formal approving review on his own PR. [GitHub review rules](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews).

Recommended initial protection: require PRs, block force pushes and deletion of `main`, and require real CI checks once they exist. Do not require a human approval count until an eligible second reviewer is available. Danny's acceptance can be an explicit instruction or PR comment, followed by an authorized merge. This is a workflow convention, not a technically enforced independent review.

Do not give agents broad admin bypasses to work around a mistaken rule. Leave auto-merge off initially. If an independent approval becomes necessary, configure an appropriately scoped identity/reviewer deliberately. Never silently share credentials among projects or change account permissions.

## 7. Coordinating multiple agents

- One owner per task/PR. Delegate bounded work; do not have two agents unknowingly implement the same issue.
- Concurrent implementation needs separate worktrees or clones, not merely two branch names in the same working directory. A branch switch in a shared checkout affects everyone there.
- Keep branches short-lived and scoped to tasks, not permanent branches named for each agent. An existing cloud-agent naming convention is fine if ownership and purpose are clear.
- Check overlapping files before starting. Serialize tightly coupled changes. After another PR merges, integrate current `main` and rerun affected tests before merging your own.
- Give a handoff containing issue/PR, branch, workspace location, latest commit, checks, unfinished work, and merge/deployment authority. Distinguish local, pushed, merged, and deployed state.
- A reviewer can inspect independently; the implementer owns fixes. Avoid two agents pushing unrelated fixes to the same branch concurrently.
- Apply this runbook to another project only after inspecting that project's actual conventions. Do not reconfigure other repositories from a Subsense task.

Copyable instruction for a substantive task:

> Work on this outcome in a task branch and linked PR. Read the repository instructions and prior context first; inspect existing work and don't overwrite it. Use a separate worktree if another agent is editing. Test and make the result available to inspect. Handle review feedback when available, and report any missing review or preview capability. Return the PR, evidence, and current state. Do not merge, deploy, change settings, or widen scope without authority for that action.

## 8. Publishing and recovery

For Subsense, recommend a manually triggered GitHub Actions Pages workflow that publishes only `site/`, not the repository root or `subsense-original-content/`. Keep production separate from previews; target an identified, accepted `main` commit. GitHub supports manual workflows with `workflow_dispatch`, once the workflow exists on the default branch. [Manual workflow runs](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow).

If a change goes wrong, first identify whether it is local, pushed, merged, or deployed. Fix unfinished work on its task branch. For a bad merged change, normally use a revert PR so shared history stays intact. For a bad deployment, restore a verified known-good deployment using the host's supported process, then reconcile `main`. A revert does not reach the public site until a deployment occurs. Do not force-reset shared history or delete source material as a rollback technique.

If CI fails, investigate before merging. If review is missing, check draft state, settings, author eligibility, and quota. If a PR conflicts, inspect the competing intent rather than accepting one side wholesale. If a live site looks stale, compare deployed commit and URL before assuming the code failed; then investigate caching.

## 9. Subsense: verified starting point and rollout

Read-only inspection on 2026-09-20 found:

| Item | Observed state |
| --- | --- |
| Repository | `dannySubsense/subsense`, public; this runbook does not change visibility |
| Default branch | `main`; branch API reports unprotected |
| Repository rulesets | None returned |
| Actions workflows | None returned; no tracked `.github/workflows/` directory |
| Open PRs at inspection | None |
| Pages | Pages API returned 404; no active Pages site verified |
| Local GitHub CLI identity | `dannySubsense` |
| Protected source corpus | `subsense-original-content/` is Git-ignored; keep it unchanged |
| Copilot automatic review | No repository rule present; personal-account settings not inspected |

The current repository has been using direct pushes to `main`. Neither automated review nor deployment should be inferred from earlier discussion. The public repository also means issue/PR text, committed files, and history are public: no credentials, private correspondence, or unselected source dumps belong there.

Recommended rollout, not performed by writing this document:

1. Adopt the branch/PR convention and point other agents to this runbook.
2. Add focused CI for the actual static site: JavaScript syntax, public-asset/link validation, browser checks, and source-safety checks. Configure required checks only after they run successfully and their exact names are known. A clean runner lacks the local ignored corpus; validate public references there, and original-source existence locally.
3. Configure the `main` ruleset and Copilot behavior above; verify it with a real PR. Do not assume the Copilot request rule alone prevents merging before feedback arrives.
4. Add a separately authorized deployment workflow, test it on the GitHub-provided URL, then connect `subsense.art` when Danny wants to switch the live domain. Preserve unrelated DNS records, including mail.

This document is guidance for coordination. It does not itself enable CI, Copilot review, branch protections, previews, deployment, or new permissions.

# Assessment 2: Test with Actions (CI)

Node.js version of [skills/test-with-actions](https://github.com/skills/test-with-actions), which uses Python.
It follows the same 5 steps and adds a few GH-200 extras.

**The project:** a tiny shopping-cart library in [src/cart.js](src/cart.js), tested with Jest in [tests/cart.test.js](tests/cart.test.js).

> ⚠️ Spoiler-free rules: the code contains **one real bug** and **a coverage gap**. Don't fix anything until a task asks you to. Let CI find them first.

Write every workflow yourself. Use only the [GitHub Docs](https://docs.github.com/actions) and your notes.

---

## Step 0: Prep

1. Commit the project to `main` and push it (`git add . && git commit -m "add node project" && git push`).
2. Run it locally: `npm ci`, then `npm test`, then `npm run test:coverage`.
3. In `NOTES.md`, write down how many tests fail and which coverage thresholds fail. Don't fix anything yet.

---

## Step 1: Testing workflow (create it in the GitHub web UI)

On github.com, go to the **Actions** tab, choose **New workflow**, and pick the **Node.js** starter workflow. Edit it until it meets every requirement below, then commit it to `main` as `.github/workflows/test.yml`.

**Requirements**

- [ ] Workflow `name: Test`
- [ ] Runs on: `push` to `main`, `pull_request` targeting `main`, and manual runs
- [ ] Does **not** run when the only changed files are Markdown files (`*.md`)
- [ ] One job, `test`, on `ubuntu-latest`, using a **matrix** over Node.js `20`, `22` and `24`
- [ ] One failing Node version must **not** cancel the others
- [ ] Uses `actions/checkout` and `actions/setup-node`, with **npm caching** enabled through `setup-node`
- [ ] Installs dependencies with the command meant for CI (not `npm install`)
- [ ] Runs `npm test`
- [ ] If you push twice quickly to the same branch or PR, the older run is **cancelled**

**Check:** the Actions tab shows 3 matrix jobs. Do you expect them to be green or red? Why?

---

## Step 2: Coverage workflow (create it in your editor, locally)

Create `.github/workflows/coverage.yml` in VS Code and push it.

**Requirements**

- [ ] Triggers on `pull_request` to `main` only
- [ ] Single Node version (24)
- [ ] Runs `npm run test:coverage`
- [ ] Uploads the `coverage/` folder as an artifact named `coverage-report`, kept for **7 days**
- [ ] The artifact uploads **even when the coverage step fails** (this matters later)
- [ ] Writes a short Markdown table of the 4 coverage percentages to the **job summary** (hint: `coverage/coverage-summary.json` plus a special environment file)
- [ ] The `GITHUB_TOKEN` has the least privilege it needs (`contents: read`)

**Stretch:** post the coverage table as a **PR comment** with `actions/github-script`. Which permission do you need to add?

---

## Step 3: Investigate and fix the failing test

1. Create the branch `fix/discount`, make any small change, push it, and open a PR to `main`.
2. Look at the PR checks. **Using only the Actions logs** (no local run), find:
   - which test fails, and the expected vs. received values
   - the file and line in `src/` that causes it
3. Re-run only the failed jobs from the UI. (Where is that button? What does it keep or reset?)
4. Fix the bug in `src/` (not the test!) and push. The `Test` workflow should turn green on all 3 Node versions.

---

## Step 4: Close the coverage gap

The `Coverage` workflow still fails because of the threshold in [jest.config.js](jest.config.js).

1. Download the `coverage-report` artifact from the failed run, open `lcov-report/index.html`, and find the uncovered lines.
2. Add tests (don't lower the threshold 😉) until coverage passes.
3. Check that the job summary shows the table from Step 2.

---

## Step 5: Require tests to pass before merging

1. In **Settings → Rules → Rulesets** (or Branches → branch protection), protect `main`:
   - require a pull request before merging
   - require status checks to pass, and add the test and coverage checks
   - require the branch to be up to date before merging
2. Prove it works: open a PR that breaks a test and confirm the **Merge** button is blocked. Then fix it and merge.

**Think about it:** every matrix leg is its own check (`test (20)`, `test (22)`, …). What happens to your required checks if you later add Node 26 or drop 20? Fix this by adding a final job, `all-tests-passed`, that `needs: test` and is the **only** required check. What `if:` does it need so that it fails (not gets *skipped*) when a matrix leg fails?

---

## Bonus (GH-200 exam favorites)

- [ ] Add `macos-latest` and `windows-latest` to the matrix, but run them only with Node 24 (`include` / `exclude`).
- [ ] Add `continue-on-error` for an "experimental" Node version and explain how it differs from `fail-fast: false`.
- [ ] Turn the test job into a **reusable workflow** (`workflow_call` with a `node-version` input) and call it from `test.yml`.
- [ ] Add a status badge for the `Test` workflow at the top of `README.md`.
- [ ] Upload a JUnit XML test report (`jest-junit`) and show it in the summary.

---

## Knowledge check

Answer in `NOTES.md` first, then open the answers.

1. What is the difference between `npm ci` and `npm install`, and why use `npm ci` in CI?
2. `actions/setup-node` with `cache: npm`: what does it cache, and what is the cache key based on?
3. A matrix has `node: [20, 22, 24]` and `os: [ubuntu-latest, windows-latest]`. How many jobs run?
4. What is the default value of `strategy.fail-fast`, and what does it do?
5. How do you run a step even if a previous step failed? Name two ways and how they differ.
6. What is the difference between `paths-ignore` and an `if:` condition on a job?
7. By default, how long are artifacts kept, and how do you change it per upload?
8. How can a job use a file produced by another job in the **same** workflow run?
9. Why is a `pull_request` run from a **fork** limited (token and secrets)?
10. What does `concurrency` with `cancel-in-progress: true` do, and what group key would you use per branch/PR?
11. Where does the job summary come from, technically?
12. Why should a required status check not depend on a matrix job name directly?

<details>
<summary>Answers</summary>

1. `npm ci` installs exactly what `package-lock.json` specifies, deletes `node_modules` first, and fails if the lockfile and `package.json` disagree. That makes builds reproducible and faster. `npm install` can update the lockfile.
2. It caches the **global npm cache** (`~/.npm`), not `node_modules`. The key is a hash of the lockfile (`package-lock.json`), plus the OS.
3. 3 × 2 = **6** jobs.
4. `true`. If any matrix job fails, GitHub cancels the in-progress and queued jobs of that matrix.
5. `if: always()` runs even if the run is cancelled. `if: failure()` runs only on failure. `if: success() || failure()` runs on either but not on cancel. `continue-on-error: true` on the *failing* step marks it as passing so later steps run normally.
6. `paths-ignore` is a trigger filter, so no run is created at all. An `if:` creates a run and then **skips** the job. Note: if a required check's workflow is skipped by a path filter, the check stays "Pending" and blocks the merge.
7. 90 days by default (configurable at repo/org level). Set `retention-days:` on `actions/upload-artifact`.
8. Upload it with `actions/upload-artifact` in job A. In job B, add `needs: A` and use `actions/download-artifact`.
9. Fork PRs could run attacker-controlled code, so secrets aren't passed and `GITHUB_TOKEN` is read-only. (`pull_request_target` runs in the base repo's context with secrets, which is dangerous if you check out the PR code.)
10. It cancels any running or queued run in the same group when a new one starts. Example: `group: ${{ github.workflow }}-${{ github.ref }}`.
11. A step appends Markdown to the file whose path is in the `$GITHUB_STEP_SUMMARY` environment variable.
12. Matrix check names change when the matrix changes, so the rule breaks or blocks forever. Use one aggregator job with `needs: [test]` and `if: always()` that fails when `needs.test.result != 'success'`. A *skipped* required check counts as passing, so you need `if: always()` to make it actually run and fail.

</details>

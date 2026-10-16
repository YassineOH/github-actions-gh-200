# Github actions notes for GH-200

## Session 1, 12 Oct 2026

+ Github action is set of packages that help team to automate their CI/CD workflow.
+ There's three type of github actions: Container actions, Javascript action and Composite actions.
+ The github actions are written in a yaml file.
+ Every file is a workflow that include jobs, then steps then actions.
+ A Github action got trigger by events like pull request, push on specific branches.
+ There's some special event like:
  +  `workflow_dispatch`: Manually trigger the workflow on github UI.
  +  `repository_dispatch`: When an external system call the workflow using a POST request.
  +  `check_run`: Listen to a webhook with set of types like requested and requested_action


### Session 2, 13 Oct 2026
+ see `.github/workflows/first-assessment.yaml`


### Session 3, 14 Oct 2026
+ CI: continuous integration is the process of automating the scripts of testing, linting and building... a software each time a new code is committed to version control in a codebase.
+ Reusable workflows are once that can be referenced by other workflows.
+ The make a workflow reusable it should include the event `workflow_call`.
+ The benefits of reusable workflows are: **Consistency**, **Efficiency**,'**Easier Updates** and **Scalability**.
+ `github.event_name` variable include the trigger that lunch a workflow.
+ Anything produced by a workflow rather than logs is called **Artifacts** like container, a file..


### Session 4, 15 Oct 2026
+ To access information in a workflow, job or step we use Environment Variables and Context.
+ The environment variable are written in all uppercase like `$GITHUB_REF`, while context vars are like `${{ github.ref }}`.
+ Environment variable could be accessed from runner only while contexts depends on the context and workflow location.
+ User defined environment variable could defined on multiple levels (workflow, job, step) using the `env` keyword.
+ A GitHub environment represents a deployment target, such as `development`, `staging`, or `production`. repository's Settings → Environments.



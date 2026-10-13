# Github actions notes for GH-200

## Session 1, 12 Oct 2026

+ Github action is set of packages that help team to automate their CI/CD workflow.
+ There's three type of github actions: Container actions, Javascript action and Composite actions.
+ The github actions are written in a yaml file.
+ Every file is a workflow that include jobs, then steps then actions.
+ A Github action got trigger by events like pull request, push on specifc branches.
+ There's some special event like:
  +  `workflow_dispatch`: Manually trigger the workflow on github UI.
  +  `repository_dispatch`: When an external system call the workflow using a POST request.
  +  `check_run`: Listen to a webhook with set of types like requested and requested_action
  +  
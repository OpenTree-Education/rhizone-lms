# Contributing Guidelines

## Issues

When a bug is encountered in the app, create a new issue and add it to the
Maintenance project. Label it with the `bug` label.

## Branches

All work is done in feature branches.

Prefix branch names with the issue number that the branch is meant to address.
For example:

```
13-add-material-ui
```

## Commits

The headlines of commit messages start with a link to the issue they're related
to. For example:

```
#14 Remove websocket proxy from api since it doesn't use websockets
```

Try to explain _why_ the change is being made in the headline.

Keep headlines to 72 characters. If needed, add a longer description after two
newlines.

## Pull requests

Complete the checklist in the pull request template. If an item doesn't apply to
the pull request, check it off.

### Merging

Ensure the branch associated with the pull request is deleted after it is merged
into the `main` branch.

# get-changed-files-action

This action gets the changed file for a given action run event.
It is only using github API, not the git command line.

NB: Only `push` and `pull_request` workflow event are supported.

## Usage

See [action.yml](action.yml)

```yaml
  - uses: ./
    id: files
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

### `token`

**Required** [GITHUB\_TOKEN](https://docs.github.com/en/actions/security-guides/automatic-token-authentication) or a repo scoped [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

## Outputs

### `all`

All the changed files.

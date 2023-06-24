# Changelogs Generator Action

Automatically generate changelogs from your `release tags` based on `pull requests` history on GitHub,

## Boostrap

Install the dependencies

```bash
npm install
```

## Package

### Build the typescript and package it for distribution

```bash
npm run build && npm run package
```

### Publish to a distribution branch

> **Note:** Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
npm run package
git add dist
git commit -a -m "prod dependencies"
git push origin releases/v1
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage

```yaml
name: Generate Changelogs
run-name: "chore(release): generate changelogs for ${{ inputs.previous_release_tag }}..${{ inputs.future_release_tag }}"

on:
  workflow_dispatch:
    inputs:
      previous_release_tag:
        required: true
        description: previous release tag
      future_release_tag:
        required: true
        description: future release tag

jobs:
  build:
    name: Generate changelogs
    runs-on: ubuntu-latest
    steps:
      - name: Generate release changelogs
        uses: daeuniverse/changelogs-generator-action@test
        id: changelog
        with:
          # https://github.com/daeuniverse/changelogs-generator-action
          previousRelease: ${{ inputs.previous_release_tag }}
          futureRelease: ${{ inputs.future_release_tag }}
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Print outputs
        shell: bash
        run: |
          echo "${{ steps.changelog.outputs.changelogs }}"
```

## Inputs

| Name              | Description          |
| ----------------- | -------------------- |
| `previousRelease` | Previous release tag |
| `futureRelease`   | Future release tag   |
| `token`           | Github auth token    |
| `verbose`         | Verbose mode         |

## Outputs

| Name         | Description                      |
| ------------ | -------------------------------- |
| `changelogs` | Contents of generated changelogs |

## References

- [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
- [@actions/github](https://www.npmjs.com/package/@actions/github)

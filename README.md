# Changelogs Generator Action

<p align="left">
  <img src="https://custom-icon-badges.herokuapp.com/github/license/daeuniverse/changelogs-generator-action?logo=law&color=white" alt="license" />
  <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fdaeuniverse%2Fchangelogs-generator-actions&count_bg=%235218CF&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false" alt="hits" />
  <img src="https://custom-icon-badges.herokuapp.com/github/issues-pr-closed/daeuniverse/changelogs-generator-action?color=purple&logo=git-pull-request&logoColor=white" alt="pr/issue" />
  <img src="https://custom-icon-badges.herokuapp.com/github/last-commit/daeuniverse/changelogs-generator-action?logo=history&logoColor=white" alt="lastcommit" />
</p>

🌌 Automatically generate changelogs from your `release tags` based on `pull requests` history on GitHub

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
        uses: daeuniverse/changelogs-generator-action@main
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

# Changelogs Generator Action

## Boostrap

Install the dependencies

```bash
$ npm install
```

## Deploy

### Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
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

TBD.

## References

- [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
- [@actions/github](https://www.npmjs.com/package/@actions/github)

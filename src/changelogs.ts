import {PullRequest} from "./types"

export default ({...props}) => {
  const owner = props.context.repo.owner
  const repo = props.context.repo.repo

  const formatMsg = (pr: PullRequest) =>
    `* ${pr.title} in [#${pr.number}](${pr.html_url}) by (@${pr.author})`

  const commits = {
    feature: props.prs
      .filter(
        (pr: PullRequest) =>
          pr.title.startsWith("feat") || pr.title.startsWith("optimize")
      )
      .map((pr: PullRequest) => formatMsg(pr))
      .join("\n"),
    fix: props.prs
      .filter(
        (pr: PullRequest) =>
          pr.title.startsWith("fix") ||
          pr.title.startsWith("hotfix") ||
          pr.title.startsWith("patch")
      )
      .map((pr: PullRequest) => formatMsg(pr))
      .join("\n"),
    other: props.prs
      .filter(
        (pr: PullRequest) =>
          pr.title.startsWith("chore") ||
          pr.title.startsWith("refactor") ||
          pr.title.startsWith("ci") ||
          pr.title.startsWith("doc") ||
          pr.title.startsWith("style")
      )
      .map((pr: PullRequest) => formatMsg(pr))
      .join("\n")
  }

  const newContributors: string[] = props.prs
    .filter((pr: PullRequest) => pr.is_new_contributor)
    .map(
      (pr: PullRequest) =>
        `* @${pr.author} made their first contribution in [#${pr.number}](${pr.html_url})`
    )
    .join("\n")

  return `
## Context

🚀 @daebot proposed the following changelogs for release v0.1.0 generated in [workflow run](https://github.com/${owner}/${repo}/actions/runs/${
    props.context.runId
  }).

## Changelogs

<!-- BEGIN CHANGELOGS -->
${commits.feature.length > 0 ? "### Features" : ""}
${commits.feature.length > 0 ? commits.feature : ""}

${commits.fix.length > 0 ? "### Bug Fixes" : ""}
${commits.fix.length > 0 ? commits.fix : ""}

${commits.other.length > 0 ? "### Others" : ""}
${commits.other.length > 0 ? commits.other : ""}

**Full Changelog**: https://github.com/${owner}/${repo}/compare/${
    props.inputs.previousRelease
  }...${props.inputs.futureRelease}

${newContributors.length > 0 ? "### New Contributors" : ""}

${newContributors.length > 0 ? newContributors : ""}
`.trim()
}

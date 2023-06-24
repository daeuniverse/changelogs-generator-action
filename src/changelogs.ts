import {PullRequest} from "./types"

export default ({...props}) => {
  const owner = props.context.repo.owner
  const repo = props.context.repo.repo

  const commits: string[] = props.prs
    .map(
      (pr: PullRequest) =>
        `* ${pr.title} in [#${pr.number}](${pr.html_url}) by (@${pr.author})`
    )
    .join("\n")

  const newContributors: string[] = props.prs
    .filter((pr: PullRequest) => pr.is_new_contributor)
    .map(
      (pr: PullRequest) =>
        `* @${pr.author} made their first contribution in [#${pr.number}](${pr.html_url})`
    )
    .join("\n")

  return `## Context

🚀 @daebot proposed the following changelogs for release v0.1.0 generated in [workflow run](https://github.com/${owner}/${repo}/actions/runs/${
    props.context.runId
  }).

## Changelogs

<!-- BEGIN CHANGELOGS -->
${commits}

**Full Changelog**: https://github.com/${owner}/${repo}/compare/${
    props.inputs.previousRelease
  }...${props.inputs.futureRelease}

${newContributors.length > 0 ? "## New Contributors" : ""}

${newContributors.length > 0 ? newContributors : ""}`.trim()
}

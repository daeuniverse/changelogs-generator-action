import {PullRequest} from "./types"

export default ({...props}) => {
  const owner = props.context.payload.repository.owner
  const repo = props.context.payload.repository.repo
  return `## Context
  🚀 @daebot proposed the following changelogs for release v0.1.0 generated in [workflow run](https://github.com/${owner}/${repo}/actions/runs/${
    props.context.runId
  }).
  ## Changelogs
  <!-- BEGIN CHANGELOGS -->
  [Full Changelog](https://github.com/${owner}/${repo}/compare/${
    props.inputs.previousRelease
  }...${props.inputs.futureRelease})
  ${props.prs.title.join("\n")}`
}

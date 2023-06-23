import * as core from "@actions/core"
import * as github from "@actions/github"

export default async () => {
  // github octokit
  const token = core.getInput("token")
  const octokit = github.getOctokit(token)
  const context = github.context

  // get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(context, undefined, 2)
  console.log(`The event payload: ${payload}`)

  // list all commits since a timestamp
  return await octokit.rest.pulls
    .list({
      repo: context.repo.repo,
      owner: context.repo.owner,
      state: "closed",
      per_page: 10
    })
    .then(res => res.data)
}

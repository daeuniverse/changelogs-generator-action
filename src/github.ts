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
  const prs = await octokit.rest.pulls
    .list({
      repo: context.repo.repo,
      owner: context.repo.owner,
      state: "closed",
      per_page: 10
    })
    .then(res => res.data)

  const prevRelease = await octokit.rest.repos
    .listReleases({
      repo: context.repo.repo,
      owner: context.repo.owner,
      per_page: 1
    })
    .then(res => res.data[0])

  return prs.filter(pr => {
    if (pr.merged_at && pr.merged_at > prevRelease.created_at) {
      return {
        number: pr.number,
        assignee: pr.user?.login,
        title: pr.title,
        labels: pr.labels,
        merged_at: pr.merged_at
      }
    }
  })
}

import * as core from "@actions/core"
import * as github from "@actions/github"
import {PullRequest} from "./types"

// github octokit
const token = core.getInput("token")
const octokit = github.getOctokit(token)
const context = github.context

interface Action {
  getContext: () => {}
  getPulls: () => Promise<PullRequest[]>
}

export const getContext = () => {
  // get the JSON webhook payload for the event that triggered the workflow
  return context
}

export const getPulls = async (): Promise<PullRequest[]> => {
  // list all commits since a timestamp
  const prs = await octokit.rest.pulls
    .list({
      repo: context.repo.repo,
      owner: context.repo.owner,
      state: "closed"
    })
    .then(res => res.data)

  const prevRelease = await octokit.rest.repos
    .listReleases({
      repo: context.repo.repo,
      owner: context.repo.owner,
      per_page: 1
    })
    .then(res => res.data[0])

  const contributors = await octokit.rest.repos
    .listContributors({
      repo: context.repo.repo,
      owner: context.repo.owner
    })
    .then(res => res.data.map(person => person))

  console.log(`Contributors: `, contributors)

  return prs
    .filter(pr => {
      return pr.merged_at && pr.merged_at > prevRelease.created_at
    })
    .map(pr => ({
      number: pr.number,
      author: pr.user?.login as string,
      title: pr.title as string,
      labels: pr.labels.map(i => i.name) as string[],
      html_url: pr.html_url as string,
      merged_at: pr.merged_at as string,
      is_new_contributor: true
    }))
}

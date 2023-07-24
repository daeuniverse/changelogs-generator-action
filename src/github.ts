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

export const getPulls = async (releaseTag: string): Promise<PullRequest[]> => {
  // list all commits since a timestamp
  const prs = await octokit.rest.pulls
    .list({
      repo: context.repo.repo,
      owner: context.repo.owner,
      state: "closed"
    })
    .then(res => res.data)

  // https://octokit.github.io/rest.js/v18#repos-get-release-by-tag
  const prevRelease = await octokit.rest.repos
    .getReleaseByTag({
      repo: context.repo.repo,
      owner: context.repo.owner,
      tag: releaseTag
    })
    .then(res => res.data)

  const contributors = await octokit.rest.repos
    .listContributors({
      repo: context.repo.repo,
      owner: context.repo.owner
    })
    .then(res => res.data.map(person => person.login))

  return prs
    .filter(pr => {
      return pr.merged_at && pr.merged_at > prevRelease.created_at
    })
    .map(pr => ({
      number: pr.number,
      author: pr.user?.login || "",
      assignees: pr.assignees ? pr.assignees.map(item => `@${item.login}`) : [],
      title: pr.title || "",
      labels: pr.labels.map(i => i.name),
      html_url: pr.html_url,
      merged_at: pr.merged_at || "",
      is_new_contributor: !contributors.includes(pr.user?.login)
    }))
}

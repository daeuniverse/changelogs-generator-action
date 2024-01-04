import * as core from "@actions/core"
import * as github from "@actions/github"
import {PullRequest} from "./types"
import {fetchPullRequestsInRange} from "./pulls"

const token = core.getInput("token")
const octokit = github.getOctokit(token)
const context = github.context

interface Action {
  getContext: () => {}
  getPulls: () => Promise<PullRequest[]>
}

export const getContext = () => {
  // Get the JSON webhook payload for the event that triggered the workflow
  return context
}

export const getPulls = async (releaseTag: string): Promise<PullRequest[]> => {
  // https://octokit.github.io/rest.js/v18#git-get-commit
  console.log(`current release tag: ${releaseTag}`)

  // Get previous release date
  const prevReleaseDate = await octokit.rest.repos
    .getCommit({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: `refs/tags/${releaseTag}`
    })
    .then(res => res.data.commit.author?.date!)
    .catch(err => console.error("releaseTag", err))

  // List all commits since a timestamp
  const prs: PullRequest[] = await fetchPullRequestsInRange(
    context.repo.owner,
    context.repo.repo,
    prevReleaseDate!
  )

  // Fetch existing contributors
  const contributors = await octokit.rest.repos
    .listContributors({
      repo: context.repo.repo,
      owner: context.repo.owner
    })
    .then(res => res.data.map(person => person.login))

  return prs
    .filter(pr => {
      return pr.merged_at && pr.merged_at > prevReleaseDate
    })
    .map(pr => ({
      ...pr,
      is_new_contributor: !contributors.includes(pr.author)
    }))
}

import * as core from "@actions/core"
import * as github from "@actions/github"

const main = async () => {
  // retrive val from inputs
  const previousRelease = core.getInput("previousRelease")
  const futureRelease = core.getInput("futureRelease")
  console.log(previousRelease, futureRelease)

  // github octokit
  const token = core.getInput("token")
  const octokit = github.getOctokit(token)
  const context = github.context

  const time = new Date().toTimeString()
  core.setOutput("time", time)

  // Get the JSON webhook payload for the event that triggered the workflow
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

  console.log(prs)
}

try {
  main()
} catch (err: any) {
  core.setFailed(err.message)
}

// const previousTagSha = (await $fetch(`/repos/${owner}/${repo}/tags`))
//   .filter(tag => tag.name === PREVIOUS_TAG)[0].commit.sha
// const commitsMessage = (await $fetch(`/repos/${owner}/${repo}/commits?sha=${previousTagSha}`))
//   // filter merge commits and not end with (#number)
//   .filter(commit => commit.parents.length === 1
//     && commit.commit.message.split('\n')[0].match(/\(#\d+\)$/))
//   .map(commit => `* ${commit.commit.message.split('\n')[0]} (@${commit.author.login})`)
//   .join('\n')

// await $fetch(`/repos/${owner}/${repo}/issues`, {
//   method: 'POST',
//   body: JSON.stringify({
//     title: `[Release Changelogs] ${FUTURE_TAG}`,
//     body:
// `## Context
// 🚀 @daebot proposed the following changelogs for release v0.1.0 generated in [workflow run](https://github.com/${owner}/${repo}/actions/runs/${RUN_ID}).
// ## Changelogs
// <!-- BEGIN CHANGELOGS -->
// [Full Changelog](https://github.com/${repo}/${repo}/compare/${PREVIOUS_TAG}...${FUTURE_TAG})
// ${commitsMessage}
// `
//   })
// })

// console.log(`## Context
// 🚀 @daebot proposed the following changelogs for release v0.1.0 generated in [workflow run](https://github.com/${owner}/${repo}/actions/runs/${RUN_ID}).
// ## Changelogs
// <!-- BEGIN CHANGELOGS -->
// [Full Changelog](https://github.com/${repo}/${repo}/compare/${PREVIOUS_TAG}...${FUTURE_TAG})
// ${commitsMessage}
// `)

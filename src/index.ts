import * as core from "@actions/core"
import * as github from "@actions/github"
import {getContext, getPulls} from "./github"
import constructChangelogs from "./changelogs"

const handler = async () => {
  try {
    // retrive val from inputs
    const previousRelease = core.getInput("previousRelease")
    const futureRelease = core.getInput("futureRelease")
    console.log(`Action inputs: ${previousRelease}, ${futureRelease}`)

    const context = getContext()
    console.log(`The event payload: ${JSON.stringify(context, undefined, 2)}`)

    // fetch pull requests since previous release
    const prs = await getPulls()
    console.log(
      `PRs since previous release: ${JSON.stringify(
        {count: prs.length, data: prs},
        undefined,
        2
      )}`
    )

    context.payload.repository?.name
    context.payload.repository?.owner
    // construct changelogs
    const changelogs = constructChangelogs({
      context: context,
      inputs: {previousRelease, futureRelease},
      prs
    })

    // set outputs
    const time = new Date().toTimeString()
    core.setOutput("time", time)
  } catch (err: any) {
    core.setFailed(err.message)
  }
}

handler()

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

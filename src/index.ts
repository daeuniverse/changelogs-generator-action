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
    const prs = await getPulls(previousRelease)
    console.log(
      `PRs since previous release: ${JSON.stringify(
        {count: prs.length, data: prs},
        undefined,
        2
      )}`
    )

    // construct changelogs
    const changelogs = constructChangelogs({
      context: context,
      inputs: {previousRelease, futureRelease},
      prs
    })

    // set outputs
    const time = new Date().toTimeString()
    core.setOutput("time", time)
    core.setOutput("changelogs", changelogs)
  } catch (err: any) {
    core.setFailed(err.message)
  }
}

handler()

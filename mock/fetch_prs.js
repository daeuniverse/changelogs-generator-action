const {graphql} = require("@octokit/graphql")

const accessToken = process.env.GITHUB_TOKEN

// Function to fetch Pull Requests within a specific time range
async function fetchPullRequestsInRange() {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${accessToken}`
    }
  })

  const fromDate = new Date("2024-01-01T00:00:00Z").toISOString()
  const toDate = new Date("2024-01-04T23:59:59Z").toISOString()
  const now = new Date().toISOString()

  const repo = "daeuniverse/dae"
  const paginationMaxItem = 100

  const query = `
    query {
      search (
        type: ISSUE,
        query: "repo:${repo} is:pr is:merged merged:${fromDate}..${now} sort:updated-asc",
        first: ${paginationMaxItem},
      ) {
        issueCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on PullRequest {
            title
            url
            number
            state
            labels (first: 10) {
              nodes {
                name
              }
            }
            assignees (first: 10) {
              nodes {
                login
              }
            }
            author {
              login
            }
            mergeCommit {
              oid
            }
            mergedAt
            baseRefName
            headRefName
          }
        }
      }
    }
  `

  try {
    const result = await graphqlWithAuth(query, {
      owner: "daeuniverse", // Replace with the repository owner's username
      name: "dae" // Replace with the repository name
    })

    const count = result.search.issueCount
    // console.log(result.search.nodes)
    const pullRequests = result.search.nodes.map(data => ({
      title: data.title,
      html_url: data.url,
      number: data.number,
      state: data.state,
      labels: data.labels.nodes.map(entry => entry.name),
      assignees: data.assignees.nodes.map(entry => entry.login),
      author: data.author.login,
      merged_commit_sha: data.mergeCommit.oid,
      merged_at: data.mergedAt,
      base_ref: data.baseRefName,
      head_ref: data.headRefName
    }))
    console.log("Pull Requests within the specified time range:", pullRequests)
  } catch (err) {
    console.error("Error fetching pull requests:", err)
  }
}

// Call the function
fetchPullRequestsInRange()

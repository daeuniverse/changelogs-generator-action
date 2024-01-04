import {graphql} from "@octokit/graphql"
import {PullRequest, GraphQLQueryResponse} from "./types"

const paginationMaxItem = 100

const fetchPullRequestsInRange = async (
  owner: string,
  repo: string,
  fromDate: string
): Promise<PullRequest[]> => {
  const now = new Date().toISOString()

  const query = `
    query {
      search (
        type: ISSUE,
        query: "repo:${owner}/${repo} is:pr is:merged merged:${fromDate}..${now} sort:updated-asc",
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
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  })

  try {
    const result: GraphQLQueryResponse = await graphqlWithAuth(query, {
      owner: owner,
      name: repo
    })

    return result.search.nodes
  } catch (err) {
    console.error("Error fetching pull requests:", err)
    throw new Error("Failed to fetch pull requests")
  }
}

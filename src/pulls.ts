import fetch from "node-fetch"
import {graphql} from "@octokit/graphql"
import {PullRequest, GraphQLQueryResponse} from "./types"

const paginationMaxItem = 100

export const fetchPullRequestsInRange = async (
  owner: string,
  repo: string,
  fromDate: string,
  token: string
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
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${token}`
    },
    request: {
      fetch: fetch
    }
  })

  try {
    const result: GraphQLQueryResponse = await graphqlWithAuth(query, {
      owner: owner,
      name: repo
    })

    return result.search.nodes.map((data: any) => ({
      title: data.title,
      html_url: data.url,
      number: data.number,
      state: data.state,
      labels: data.labels.nodes.map((entry: any) => entry.name),
      assignees: data.assignees.nodes.map((entry: any) => entry.login),
      author: data.author.login,
      merged_commit_sha: data.mergeCommit.oid,
      merged_at: data.mergedAt,
      base_ref: data.baseRefName,
      head_ref: data.headRefName
    }))
  } catch (err) {
    console.error("Error fetching pull requests:", err)
    throw new Error("Failed to fetch pull requests")
  }
}

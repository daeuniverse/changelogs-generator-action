"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const graphql_1 = require("@octokit/graphql");
const paginationMaxItem = 100;
const fetchPullRequestsInRange = (owner, repo, fromDate) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date().toISOString();
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
  `;
    const graphqlWithAuth = graphql_1.graphql.defaults({
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`
        },
        request: {
            fetch: node_fetch_1.default // Provide the fetch implementation here
        }
    });
    try {
        const result = yield graphqlWithAuth(query, {
            owner: owner,
            name: repo
        });
        return result.search.nodes;
    }
    catch (err) {
        console.error("Error fetching pull requests:", err);
        throw new Error("Failed to fetch pull requests");
    }
});

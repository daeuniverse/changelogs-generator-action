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
exports.fetchPullRequestsInRange = void 0;
const node_fetch_1 = require("node-fetch");
const graphql_1 = require("@octokit/graphql");
const paginationMaxItem = 100;
const fetchPullRequestsInRange = (owner, repo, fromDate, token) => __awaiter(void 0, void 0, void 0, function* () {
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
  `;
    const graphqlWithAuth = graphql_1.graphql.defaults({
        headers: {
            authorization: `token ${token}`
        },
        request: {
            fetch: node_fetch_1.default
        }
    });
    try {
        const result = yield graphqlWithAuth(query, {
            owner: owner,
            name: repo
        });
        console.log(result.search.nodes.map((data) => ({
            author: data.author
        })));
        return result.search.nodes.map((data) => ({
            title: data.title,
            html_url: data.url,
            number: data.number,
            state: data.state,
            labels: data.labels.nodes.map((entry) => entry.name),
            assignees: data.assignees.nodes.map((entry) => entry.login),
            author: data.author.login,
            merged_commit_sha: data.mergeCommit.oid,
            merged_at: data.mergedAt,
            base_ref: data.baseRefName,
            head_ref: data.headRefName
        }));
    }
    catch (err) {
        console.error("Error fetching pull requests:", err);
        throw new Error("Failed to fetch pull requests");
    }
});
exports.fetchPullRequestsInRange = fetchPullRequestsInRange;

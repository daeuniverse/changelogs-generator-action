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
exports.getPulls = exports.getContext = void 0;
const core = require("@actions/core");
const github = require("@actions/github");
const pulls_1 = require("./pulls");
const token = core.getInput("token");
const octokit = github.getOctokit(token);
const context = github.context;
const getContext = () => {
    // Get the JSON webhook payload for the event that triggered the workflow
    return context;
};
exports.getContext = getContext;
const getPulls = (releaseTag) => __awaiter(void 0, void 0, void 0, function* () {
    // https://octokit.github.io/rest.js/v18#git-get-commit
    console.log(`current release tag: ${releaseTag}`);
    // Get previous release date
    const prevReleaseDate = yield octokit.rest.repos
        .getCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `refs/tags/${releaseTag}`
    })
        .then(res => { var _a; return (_a = res.data.commit.author) === null || _a === void 0 ? void 0 : _a.date; })
        .catch(err => console.error("releaseTag", err));
    // List all commits since a timestamp
    const prs = yield (0, pulls_1.fetchPullRequestsInRange)(context.repo.owner, context.repo.repo, prevReleaseDate);
    // Fetch existing contributors
    const contributors = yield octokit.rest.repos
        .listContributors({
        repo: context.repo.repo,
        owner: context.repo.owner
    })
        .then(res => res.data.map(person => person.login));
    return prs
        .filter(pr => {
        return pr.merged_at && pr.merged_at > prevReleaseDate;
    })
        .map(pr => (Object.assign(Object.assign({}, pr), { is_new_contributor: contributors.includes(pr.author) })));
});
exports.getPulls = getPulls;

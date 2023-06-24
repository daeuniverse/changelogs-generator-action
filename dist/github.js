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
// github octokit
const token = core.getInput("token");
const octokit = github.getOctokit(token);
const context = github.context;
const getContext = () => {
    // get the JSON webhook payload for the event that triggered the workflow
    return context;
};
exports.getContext = getContext;
const getPulls = () => __awaiter(void 0, void 0, void 0, function* () {
    // list all commits since a timestamp
    const prs = yield octokit.rest.pulls
        .list({
        repo: context.repo.repo,
        owner: context.repo.owner,
        state: "closed"
    })
        .then(res => res.data);
    const prevRelease = yield octokit.rest.repos
        .listReleases({
        repo: context.repo.repo,
        owner: context.repo.owner,
        per_page: 1
    })
        .then(res => res.data[0]);
    const contributors = yield octokit.rest.repos
        .listContributors({
        repo: context.repo.repo,
        owner: context.repo.owner
    })
        .then(res => res.data.map(person => person.name));
    return prs
        .filter(pr => {
        return pr.merged_at && pr.merged_at > prevRelease.created_at;
    })
        .map(pr => {
        var _a, _b;
        return ({
            number: pr.number,
            author: (_a = pr.user) === null || _a === void 0 ? void 0 : _a.login,
            title: pr.title,
            labels: pr.labels.map(i => i.name),
            html_url: pr.html_url,
            merged_at: pr.merged_at,
            is_new_contributor: contributors.includes((_b = pr.user) === null || _b === void 0 ? void 0 : _b.login)
        });
    });
});
exports.getPulls = getPulls;

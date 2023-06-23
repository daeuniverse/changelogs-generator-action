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
const core = require("@actions/core");
const github = require("@actions/github");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    // github octokit
    const token = core.getInput("token");
    const octokit = github.getOctokit(token);
    const context = github.context;
    // get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(context, undefined, 2);
    console.log(`The event payload: ${payload}`);
    // list all commits since a timestamp
    const prs = yield octokit.rest.pulls
        .list({
        repo: context.repo.repo,
        owner: context.repo.owner,
        state: "closed",
        per_page: 10
    })
        .then(res => res.data);
    const prevRelease = yield octokit.rest.repos
        .listReleases({
        repo: context.repo.repo,
        owner: context.repo.owner,
        per_page: 1
    })
        .then(res => res.data[0]);
    return prs
        .filter(pr => {
        return pr.merged_at && pr.merged_at > prevRelease.created_at;
    })
        .map(pr => {
        var _a;
        return ({
            number: pr.number,
            assignee: (_a = pr.user) === null || _a === void 0 ? void 0 : _a.login,
            title: pr.title,
            labels: pr.labels,
            merged_at: pr.merged_at
        });
    });
});

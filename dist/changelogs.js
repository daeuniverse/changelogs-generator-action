"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (_a) => {
    var props = __rest(_a, []);
    const owner = props.context.payload.repository.owner;
    const repo = props.context.payload.repository.repo;
    const commits = props.prs
        .map((pr) => `* ${pr.title} in [#${pr.number}](${pr.html_url}) by (@${pr.author})`)
        .join("\n");
    return `## Context

🚀 @daebot proposed the following changelogs for release v0.1.0 generated in [workflow run](https://github.com/${owner}/${repo}/actions/runs/${props.context.runId}).

## Changelogs

<!-- BEGIN CHANGELOGS -->
[Full Changelog](https://github.com/${owner}/${repo}/compare/${props.inputs.previousRelease}...${props.inputs.futureRelease})
${commits}`;
};

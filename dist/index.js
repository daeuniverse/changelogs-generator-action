require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 318:
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (_a) => {
    var props = __rest(_a, []);
    const owner = props.context.repo.owner;
    const repo = props.context.repo.repo;
    const formatMsg = (pr) => `- ${pr.title} in [#${pr.number}](${pr.html_url}) by (@${pr.author})`;
    const commits = {
        feature: props.prs
            .filter((pr) => pr.title.startsWith("feat") || pr.title.startsWith("optimize"))
            .map((pr) => formatMsg(pr))
            .join("\n"),
        fix: props.prs
            .filter((pr) => pr.title.startsWith("fix") ||
            pr.title.startsWith("hotfix") ||
            pr.title.startsWith("patch"))
            .map((pr) => formatMsg(pr))
            .join("\n"),
        other: props.prs
            .filter((pr) => pr.title.startsWith("chore") ||
            pr.title.startsWith("refactor") ||
            pr.title.startsWith("ci") ||
            pr.title.startsWith("doc") ||
            pr.title.startsWith("style"))
            .map((pr) => formatMsg(pr))
            .join("\n")
    };
    const newContributors = props.prs
        .filter((pr) => pr.is_new_contributor)
        .map((pr) => `- @${pr.author} made their first contribution in [#${pr.number}](${pr.html_url})`)
        .join("\n");
    const content = `
${commits.feature.length > 0 ? "### Features" : ""}
${commits.feature.length > 0 ? commits.feature : ""}

${commits.fix.length > 0 ? "### Bug Fixes" : ""}
${commits.fix.length > 0 ? commits.fix : ""}

${commits.other.length > 0 ? "### Others" : ""}
${commits.other.length > 0 ? commits.other : ""}
  `.trim();
    return `
## Context

🚀 @daebot proposed the following changelogs for release v0.1.0 generated in [workflow run](https://github.com/${owner}/${repo}/actions/runs/${props.context.runId}).

## Changelogs

<!-- BEGIN CHANGELOGS -->
${content}

${repo === "dae"
        ? `**Example Config**: https://github.com/daeuniverse/dae/blob/${props.inputs.futureRelease}/example.dae`
        : ""}

**Full Changelog**: https://github.com/${owner}/${repo}/compare/${props.inputs.previousRelease}...${props.inputs.futureRelease}

${newContributors.length > 0 ? "## New Contributors" : ""}

${newContributors.length > 0 ? newContributors : ""}
`.trim();
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[318](0, __webpack_exports__);
/******/ 	module.exports = __webpack_exports__;
/******/
/******/ })()
;
//# sourceMappingURL=index.js.map

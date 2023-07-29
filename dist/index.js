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
const github_1 = require("./github");
const changelogs_1 = require("./changelogs");
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // retrive val from inputs
        const previousRelease = core.getInput("previousRelease");
        const futureRelease = core.getInput("futureRelease");
        console.log(`Action inputs: ${previousRelease}, ${futureRelease}`);
        const context = (0, github_1.getContext)();
        console.log(`The event payload: ${JSON.stringify(context, undefined, 2)}`);
        // fetch pull requests since previous release
        const prs = yield (0, github_1.getPulls)(previousRelease);
        console.log(`PRs since previous release: ${JSON.stringify({ count: prs.length, data: prs }, undefined, 2)}`);
        // construct changelogs
        const changelogs = (0, changelogs_1.default)({
            context: context,
            inputs: { previousRelease, futureRelease },
            prs
        });
        // set outputs
        const time = new Date().toTimeString();
        core.setOutput("time", time);
        core.setOutput("changelogs", changelogs);
    }
    catch (err) {
        core.setFailed(err.message);
    }
});
handler();

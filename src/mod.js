"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../config/config.json");
const GlobalChanges_1 = __importDefault(require("./Changers/GlobalChanges"));
class QuestDifficultyTweaker {
    postSptLoad(container) {
        try {
            if (config_json_1.enable)
                (0, GlobalChanges_1.default)(container);
        }
        catch (error) {
            console.error(error);
        }
    }
}
module.exports = { mod: new QuestDifficultyTweaker() };
//# sourceMappingURL=mod.js.map
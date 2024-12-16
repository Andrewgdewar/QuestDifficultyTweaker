"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GlobalChanges;
const config_json_1 = __importDefault(require("../../config/config.json"));
const localeConfig_json_1 = __importDefault(require("../../config/localeConfig.json"));
const utils_1 = require("../Utils/utils");
const QuestRewardType_1 = require("C:/snapshot/project/obj/models/enums/QuestRewardType");
const QuestTypeEnum_1 = require("C:/snapshot/project/obj/models/enums/QuestTypeEnum");
function GlobalChanges(container) {
    const databaseServer = container.resolve("DatabaseServer");
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    const quests = tables.templates.quests;
    const { languages, global } = tables.locales;
    let gunsmithCount = 0;
    Object.keys(quests).forEach((questId) => {
        const currentQuest = quests[questId];
        let currentQuestLevel = 1;
        if (currentQuest?.conditions?.AvailableForFinish?.length) {
            currentQuest.conditions.AvailableForStart.forEach((req, key) => {
                //Adjust level req
                if (req.conditionType === "Level") {
                    currentQuestLevel = Number(req.value) || 1;
                    currentQuest.conditions.AvailableForStart[key].value =
                        Math.round(Number(req.value) * config_json_1.default.questLevelUnlockModifier) ||
                            1;
                }
            });
        }
        if (currentQuest?.conditions?.AvailableForFinish?.length) {
            currentQuest.conditions.AvailableForFinish.forEach((condition, key) => {
                switch (condition.conditionType) {
                    case "LeaveItemAtLocation":
                    case "PlaceBeacon":
                        if (config_json_1.default.plantTimeModifier === 1)
                            break;
                        currentQuest.conditions.AvailableForFinish[key].plantTime =
                            Math.round(currentQuest.conditions.AvailableForFinish[key].plantTime *
                                config_json_1.default.plantTimeModifier) || 1;
                        break;
                    case "CounterCreator":
                        if (Number(condition.value) === 1 ||
                            config_json_1.default.killQuestCountModifier === 1) {
                            break;
                        }
                        currentQuest.conditions.AvailableForFinish[key].value =
                            Math.round(Number(currentQuest.conditions.AvailableForFinish[key].value) *
                                config_json_1.default.killQuestCountModifier) || 1;
                    case "HandoverItem":
                    case "FindItem":
                        if (config_json_1.default.findItemQuestModifier === 1)
                            break;
                        const target = (currentQuest.conditions.AvailableForFinish[key].target?.[0]
                            ? currentQuest.conditions.AvailableForFinish[key].target[0]
                            : currentQuest.conditions.AvailableForFinish[key].target);
                        if (items[target]?._props?.QuestItem)
                            break;
                        currentQuest.conditions.AvailableForFinish[key].value =
                            Math.round(Number(currentQuest.conditions.AvailableForFinish[key].value) *
                                config_json_1.default.findItemQuestModifier) || 1;
                        break;
                    default:
                        break;
                }
            });
        }
        if (config_json_1.default.replaceGunsmith &&
            currentQuest.type === QuestTypeEnum_1.QuestTypeEnum.WEAPON_ASSEMBLY) {
            gunsmithCount++;
            const languageList = Object.keys(languages);
            currentQuest.type = QuestTypeEnum_1.QuestTypeEnum.ELIMINATION;
            const killQuest = (0, utils_1.getKillQuestForGunsmith)((0, utils_1.getNumbersFromString)(currentQuest.QuestName));
            const descriptionId = currentQuest._id + " questTweakerDescription";
            const taskId = currentQuest._id + " questTweakerTask";
            killQuest.id = taskId;
            currentQuest.description = descriptionId;
            if (typeof currentQuest.conditions.AvailableForFinish[0].target === "string") {
                killQuest.counter.conditions[0].weapon = [
                    currentQuest.conditions.AvailableForFinish[0].target,
                ];
                languageList.forEach((lang) => {
                    const locale = (localeConfig_json_1.default?.[lang] || localeConfig_json_1.default.en);
                    global[lang][descriptionId] = locale.description.replace("<weapon>", global[lang][currentQuest.conditions.AvailableForFinish[0].target]);
                    global[lang][taskId] = locale.task
                        .replace("<weapon>", global[lang][currentQuest.conditions.AvailableForFinish[0].target +
                        " ShortName"])
                        .replace("<number>", killQuest.value + "");
                    if (config_json_1.default.debug && lang === "en") {
                        console.log(global[lang][descriptionId]);
                        console.log(global[lang][taskId]);
                    }
                });
            }
            else {
                killQuest.counter.conditions[0].weapon =
                    currentQuest.conditions.AvailableForFinish[0].target;
                languageList.forEach((lang) => {
                    const locale = (localeConfig_json_1.default?.[lang] || localeConfig_json_1.default.en);
                    global[lang][descriptionId] = locale.description.replace("<weapon>", global[lang][currentQuest.conditions.AvailableForFinish[0].target[0] + " Name"]);
                    global[lang][taskId] = locale.task
                        .replace("<weapon>", global[lang][currentQuest.conditions.AvailableForFinish[0].target[0] +
                        " ShortName"])
                        .replace("<number>", killQuest.value + "");
                    if (config_json_1.default.debug && lang === "en") {
                        console.log(global[lang][descriptionId]);
                        console.log(global[lang][taskId]);
                    }
                });
            }
            currentQuest.conditions.AvailableForFinish = [killQuest];
        }
        if (currentQuest?.rewards?.Success?.length) {
            currentQuest.rewards.Success.forEach((item, key) => {
                switch (item.type) {
                    case QuestRewardType_1.QuestRewardType.EXPERIENCE:
                        if (config_json_1.default.questExperienceModifier === 1)
                            break;
                        if (item?.value && Number(item.value) > 0)
                            currentQuest.rewards.Success[key] = {
                                ...item,
                                value: (Math.round(Number(item.value) * config_json_1.default.questExperienceModifier) || 1).toString(),
                            };
                        break;
                    case QuestRewardType_1.QuestRewardType.ITEM:
                        if (config_json_1.default.itemRewardModifier === 1)
                            break;
                        switch (true) {
                            case item.items?.length > 1 || !item.items?.[0]:
                                break;
                            case Number(item.value) === 1:
                                break;
                            default:
                                item.value = (Math.round(Number(item.value) * config_json_1.default.itemRewardModifier) ||
                                    1).toString();
                                item.items[0].upd.StackObjectsCount =
                                    Math.round(Number(item.items[0].upd.StackObjectsCount) *
                                        config_json_1.default.itemRewardModifier) || 1;
                                break;
                        }
                        break;
                    case QuestRewardType_1.QuestRewardType.TRADER_STANDING:
                        if (config_json_1.default.traderStandingRewardModifier === 1) {
                            break;
                        }
                        // console.log("\n" + item.value + " -");
                        item.value = (Math.round((Number(item.value) / 0.05) *
                            config_json_1.default.traderStandingRewardModifier *
                            0.05 *
                            100) / 100).toString();
                        // console.log(item.value);
                        break;
                    default:
                        break;
                }
            });
        }
    });
    // saveToFile(quests, "refDBS/quests1.json");
    config_json_1.default.debug && console.log("QuestDifficultyTweaker - Changes Complete");
}
//# sourceMappingURL=GlobalChanges.js.map
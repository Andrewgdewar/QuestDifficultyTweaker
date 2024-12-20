"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumbersFromString = exports.getKillQuestForGunsmith = exports.cloneDeep = exports.getNewMongoId = exports.saveToFile = void 0;
const saveToFile = (data, filePath) => {
    var fs = require("fs");
    let dir = __dirname;
    let dirArray = dir.split("\\");
    const directory = `${dirArray[dirArray.length - 5]}/${dirArray[dirArray.length - 4]}/${dirArray[dirArray.length - 3]}/${dirArray[dirArray.length - 2]}/`;
    console.log(directory);
    fs.writeFile(directory + filePath, JSON.stringify(data, null, 4), function (err) {
        if (err)
            throw err;
    });
};
exports.saveToFile = saveToFile;
const getNewMongoId = (items) => {
    const newId = ((new Date().getTime() / 1000) | 0).toString(16) +
        "xxxxxxxxxxxxxxxx"
            .replace(/[x]/g, function () {
            return ((Math.random() * 16) | 0).toString(16);
        })
            .toLowerCase();
    if (!!items[newId])
        return (0, exports.getNewMongoId)(items);
    return newId;
};
exports.getNewMongoId = getNewMongoId;
const defaultKillQuest = {
    completeInSeconds: 0,
    conditionType: "CounterCreator",
    counter: {
        conditions: [
            {
                bodyPart: [],
                compareMethod: ">=",
                conditionType: "Kills",
                daytime: {
                    from: 0,
                    to: 0,
                },
                distance: {
                    compareMethod: ">=",
                    value: 0,
                },
                dynamicLocale: false,
                enemyEquipmentExclusive: [],
                enemyEquipmentInclusive: [],
                enemyHealthEffects: [],
                id: "655e484b52dc506c051b4409",
                resetOnSessionEnd: false,
                savageRole: [],
                target: "Any",
                value: 1,
                weapon: [],
                weaponCaliber: [],
                weaponModsExclusive: [],
                weaponModsInclusive: [],
            },
        ],
        id: "655e483da3ee7d4c56241e18",
    },
    doNotResetIfCounterCompleted: false,
    dynamicLocale: false,
    globalQuestCounterId: "",
    id: "655e483da3ee7d4c56241e17",
    index: 0,
    isNecessary: false,
    isResetOnConditionFailed: false,
    oneSessionOnly: false,
    parentId: "",
    type: "Elimination",
    value: 5,
    visibilityConditions: [],
};
const cloneDeep = (objectToClone) => JSON.parse(JSON.stringify(objectToClone));
exports.cloneDeep = cloneDeep;
const getKillQuestForGunsmith = (count) => {
    const additionalBots = Math.round((count / 24) * 4) * 5;
    const killQuest = (0, exports.cloneDeep)(defaultKillQuest);
    killQuest.value = additionalBots + 5;
    return killQuest;
};
exports.getKillQuestForGunsmith = getKillQuestForGunsmith;
const numbers = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
const getNumbersFromString = (str) => {
    return Number(str
        .split("")
        .filter((val) => numbers.has(val))
        .join(""));
};
exports.getNumbersFromString = getNumbersFromString;
//# sourceMappingURL=utils.js.map
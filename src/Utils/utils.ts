import { IQuestCondition } from "@spt/models/eft/common/tables/IQuest";

export const saveToFile = (data, filePath) => {
  var fs = require("fs");
  let dir = __dirname;
  let dirArray = dir.split("\\");
  const directory = `${dirArray[dirArray.length - 5]}/${
    dirArray[dirArray.length - 4]
  }/${dirArray[dirArray.length - 3]}/${dirArray[dirArray.length - 2]}/`;
  console.log(directory);
  fs.writeFile(
    directory + filePath,
    JSON.stringify(data, null, 4),
    function (err) {
      if (err) throw err;
    }
  );
};

export const getNewMongoId = (items) => {
  const newId =
    ((new Date().getTime() / 1000) | 0).toString(16) +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase();

  if (!!items[newId]) return getNewMongoId(items);
  return newId;
};

const defaultKillQuest: IQuestCondition = {
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
export const cloneDeep = (objectToClone: any) =>
  JSON.parse(JSON.stringify(objectToClone));

export const getKillQuestForGunsmith = (count: number): IQuestCondition => {
  const additionalBots = Math.round((count / 24) * 4) * 5;

  const killQuest: IQuestCondition = cloneDeep(defaultKillQuest);

  killQuest.value = additionalBots + 5;
  return killQuest;
};

const numbers = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);

export const getNumbersFromString = (str: string) => {
  return Number(
    str
      .split("")
      .filter((val) => numbers.has(val))
      .join("")
  );
};

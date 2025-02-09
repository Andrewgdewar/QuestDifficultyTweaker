/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import { enable } from "../config/config.json";
import GlobalChanges from "./Changers/GlobalChanges";
import { getNewMongoId, saveToFile } from "./Utils/utils";

class QuestDifficultyTweaker implements IPostSptLoadMod {
  postSptLoad(container: DependencyContainer): void {
    try {
      if (enable) GlobalChanges(container);

      // const list = new Array(50).fill("").map(_ => getNewMongoId())
      // saveToFile({ list }, "list.json")
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { mod: new QuestDifficultyTweaker() };

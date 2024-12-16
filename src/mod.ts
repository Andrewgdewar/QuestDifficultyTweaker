/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import { enable } from "../config/config.json";
import GlobalChanges from "./Changers/GlobalChanges";

class QuestDifficultyTweaker implements IPostSptLoadMod {
  postSptLoad(container: DependencyContainer): void {
    try {
      if (enable) GlobalChanges(container);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { mod: new QuestDifficultyTweaker() };

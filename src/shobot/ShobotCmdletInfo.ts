import ShobotCmdlet, { ShobotMessageStreamController } from "./ShobotCmdlet";
import ShobotDataStore from "./ShobotDataStore";

export default interface ShobotCmdletInfo {
  new (
    controller: ShobotMessageStreamController,
    userDataStore?: ShobotDataStore,
  ): ShobotCmdlet;

  get commandAlias(): string[];
  get commandName(): string;
  get commandHelp(): string | undefined;
}

import { ShobotMessage } from "./ShobotMessage";
import ShobotDataStore from "./ShobotDataStore";

export type ShobotMessageStreamController = Omit<
  ReadableStreamDefaultController<ShobotMessage>,
  "close"
>;

export default abstract class ShobotCmdlet {
  protected controller: ShobotMessageStreamController;
  protected data?: ShobotDataStore;

  constructor(
    controller: ShobotMessageStreamController,
    userDataStore?: ShobotDataStore,
  ) {
    this.controller = controller;
    this.data = userDataStore
  }

  static get commandAlias(): string[] {
    return [];
  }
  static get commandName(): string {
    return "";
  }
  static get commandHelp(): string | undefined {
    return undefined;
  }

  abstract run(...args: string[]): Promise<void> | void;
}

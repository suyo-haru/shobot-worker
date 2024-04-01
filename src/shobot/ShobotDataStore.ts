import { ShobotClassContext, ShobotContext, ShobotUserContext } from "./ShobotContext";

export type ShobotClassOrUserContext<T extends ShobotContext> = T extends ShobotUserContext ? ShobotUserContext : ShobotClassContext;

export default abstract class ShobotDataStore<T extends ShobotContext = ShobotContext> {
  #context: T;
  constructor(context: T) {
    this.#context = context;
  }

  abstract get<S = unknown>(key: keyof ShobotClassOrUserContext<T>): S;
  abstract set(key: keyof ShobotClassOrUserContext<T>, value: unknown): void;
}
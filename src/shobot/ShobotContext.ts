export type ShobotContext = ShobotUserContext | ShobotClassContext;

export interface ShobotUserContext {
  type: "user";
  id: string;
}

export interface ShobotClassContext {
  type: "class";
  id: string;
  children?: ShobotContext[];
  from: ShobotUserContext;
}
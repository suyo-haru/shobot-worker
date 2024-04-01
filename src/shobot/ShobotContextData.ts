export type ShobotContextData = ShobotClassContextData | ShobotUserContextData;

export interface ShobotClassContextData {
  talk: {};
  nexthook: string;
}

export interface ShobotUserContextData extends ShobotClassContextData {
  run: number;
  name: string;
  game: {
    "01": {
      win: number;
      lose: number;
    };
  };
}

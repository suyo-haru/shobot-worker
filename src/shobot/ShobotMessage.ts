import type { FlexContainer } from "@line/bot-sdk";
import { ShobotAction } from "./ShobotAction";

export type ShobotMessage =
  | ShobotBaseMessage
  | ShobotFlexMessage;

export type ShobotBaseMessage =
  | ShobotTextMessage
  | ShobotImageMessage
  | ShobotAnchorMessage
  | ShobotPushMessage
  | ShobotActionMessage;

export type ShobotTextMessage = {
  type: "text";
  text: string;
};

export type ShobotImageMessage = {
  type: "image";
  url: string;
};

//TODO: Flexメッセージなど、LINE Messeging API限定のMessageをどうにかしたい
export type ShobotFlexMessage = {
  type: "flex";
  alt: string;
  flex: FlexContainer;
  alternative: ShobotBaseMessage;
};

export type ShobotMenuMessage = {
  type: "menu";
  menu: ShobotAction[];
};

export type ShobotAnchorMessage = {
  type: "anchor";
  anchorName: string;
  href: string;
  alternative: ShobotMessage;
};

export type ShobotPushMessage = {
  type: "push";
};

export type ShobotActionMessage = {
  type: "action";
  action: "vanishbymyself";
};

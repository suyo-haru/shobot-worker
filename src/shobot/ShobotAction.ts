export type ShobotAction = {
  type: "link" | "select" | "sendMessage" | "selectImage";
  name: string;
} & (ShobotSelectAction | ShobotSendMessageAction | ShobotLinkAction);

export type ShobotSelectAction = {
  type: "select";
  arg: string;
};

export type ShobotSendMessageAction = {
  type: "sendMessage";
  text: string;
};

export type ShobotLinkAction = {
  type: "link";
  url: string;
};

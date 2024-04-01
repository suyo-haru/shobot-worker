import ShobotCmdletInfo from "./ShobotCmdletInfo";

export function searchCmdlet(cmdlets: ShobotCmdletInfo[], cmdarg: string):
  | ShobotCmdletInfo
  | undefined {
  let cmdletMap: Map<
    string[],
    ShobotCmdletInfo
  > = new Map<
    string[],
    ShobotCmdletInfo
  >();
  for (const cmdlet of cmdlets) {
    cmdletMap.set(cmdlet.commandAlias as string[], cmdlet);
  }
  for (const cmdletAlias of cmdletMap.keys()) {
    if (cmdletAlias.findIndex(text => cmdarg.includes(text)) >= 0) {
      return cmdletMap.get(cmdletAlias);
    }
  }
}

export function waitTimeOut(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

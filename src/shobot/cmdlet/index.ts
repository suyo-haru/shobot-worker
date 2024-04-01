import help from "./help";
import choosegame from "./choosegame";
import yesno from "./yesno";
import dice from "./dice";
import echo from "./echo";
import kill from "./kill";
import greedings from "./greedings";
import talk from "./talk";
import timer from "./timer";
import game from "./game";
import server from "./server";
import ver from "./ver";
import ShobotCmdletInfo from "../ShobotCmdletInfo";
const cmdlets: (ShobotCmdletInfo)[] = [
  help,
  choosegame,
  yesno,
  dice,
  echo,
  kill,
  greedings,
  talk,
  timer,
  game,
  server,
  ver
];
export default cmdlets;

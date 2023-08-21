import { run as mainRun } from "./main";
// import { run as postRun } from "./post";

export enum Command {
  Main,
  //  Post,
}

export async function run(command: Command): Promise<void> {
  switch (command) {
    case Command.Main:
      return await mainRun();
    // case Command.Post:
    //   return await postRun();
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

import { getInput, addPath } from "@actions/core";
import { downloadTool, extractTar, cacheDir, find } from "@actions/tool-cache";

interface Inputs {
  version: string;
}

export async function run(): Promise<void> {
  const inputs: Inputs = {
    version: getInput("version"),
  };

  let cachedPath = find("rig", inputs.version, "amd64");
  if (!cachedPath) {
    let version = inputs.version;
    if (inputs.version !== "latest") {
      version = `v${inputs.version}`;
    }

    const file = await downloadTool(
      `https://github.com/rigdev/rig/releases/${version}/download/rig_linux_x86_64.tar.gz`,
    );
    const extractedPath = await extractTar(file, "/tmp/rig/test");
    cachedPath = await cacheDir(extractedPath, "rig", inputs.version, "amd64");
  }

  addPath(cachedPath);
}

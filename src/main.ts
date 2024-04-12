import { env } from "process";
import { getInput, addPath, info } from "@actions/core";
import { downloadTool, extractTar, cacheDir, find } from "@actions/tool-cache";
import { exec, ExecOptions } from "@actions/exec";
import { HttpClient } from "@actions/http-client";

interface Inputs {
  version: string;
  host: string;
  clientId: string;
  clientSecret: string;
}

interface Release {
  name: string;
}

export async function run(): Promise<void> {
  const inputs: Inputs = {
    version: getInput("version"),
    host: getInput("host"),
    clientId: getInput("client-id"),
    clientSecret: getInput("client-secret"),
  };

  let version = inputs.version;

  if (version === "latest") {
    const client = new HttpClient();
    const response = await client.getJson<Release>(
      "https://api.github.com/repos/rigdev/rig/releases/latest"
    );
    if (response.result) {
      version = response.result.name;
    }
  }

  let cachedPath = find("rig", version, "amd64");
  if (!cachedPath) {
    const path = `https://github.com/rigdev/rig/releases/download/${version}/rig_linux_x86_64.tar.gz`;

    const file = await downloadTool(path);
    const extractedPath = await extractTar(file, "/tmp/rig/test");
    cachedPath = await cacheDir(extractedPath, "rig", version, "amd64");
  }

  addPath(cachedPath);

  if (inputs.host || inputs.clientId || inputs.clientSecret) {
    info("Running `rig auth activate-service-account`");

    const args = ["auth", "activate-service-account"];
    if (inputs.host) {
      args.push("--host", inputs.host);
    }

    await exec("rig", args, {
      env: {
        ...env,
        RIG_CLIENT_ID: inputs.clientId,
        RIG_CLIENT_SECRET: inputs.clientSecret,
      },
    });
  }
}

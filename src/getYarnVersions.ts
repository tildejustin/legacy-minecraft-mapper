import {YARN_VERSION_ENDPOINT} from "./config.js";
import YarnVersions from "./YarnVersions.js";
import {YarnVersionsJson} from "./YarnVersionsJson";

async function getYarnVersions(): Promise<YarnVersions> {
    const response = await fetch(YARN_VERSION_ENDPOINT);

    if (!response.ok) {
        console.error("Failed to fetch Yarn versions:", response);
        throw new Error("Failed to fetch Yarn versions.");
    }

    const json: YarnVersionsJson = await response.json();

    return new YarnVersions(json);
}

export default getYarnVersions;

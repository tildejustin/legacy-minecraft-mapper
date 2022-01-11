import {YarnVersionJson, YarnVersionsJson} from "./YarnVersionsJson.js";

export type GameVersion = {
    version: string;
    stable: boolean;
};

export default class YarnVersions {

    private readonly latestYarnByGameVersion = new Map<string, YarnVersionJson>();

    readonly gameVersions: GameVersion[] = [];

    constructor(private readonly versionsJson: YarnVersionsJson) {

        // Collect all unique game versions and map them to their latest yarn mappings
        const versionToLatestYarn = new Map<string, YarnVersionJson>();
        for (let versionJson of versionsJson) {
            let gameVersion = versionJson.gameVersion;
            // This assumes the incoming list is already sorted newest->oldest
            if (!this.gameVersions.some(gv => gv.version === gameVersion)) {
                this.gameVersions.push({
                    version: gameVersion,
                    stable: versionJson.stable
                });
            }

            const curVersion = versionToLatestYarn.get(gameVersion);
            // if (curVersion && curVersion.build > versionJson.build && curVersion.stable) {
            if (curVersion && curVersion.build > versionJson.build) {
                continue; // Already have a newer stable build
            }
            versionToLatestYarn.set(gameVersion, versionJson);
        }
        this.latestYarnByGameVersion = versionToLatestYarn;
    }

    getYarnForGameVersion(gameVersion: string): YarnVersionJson {
        const result = this.latestYarnByGameVersion.get(gameVersion);
        if (!result) {
            throw new Error("Unable to find Yarn version for: " + gameVersion);
        }
        return result;
    }

}

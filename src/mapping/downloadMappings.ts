import {YarnVersionJson} from "../yarn/YarnVersionsJson.js";
import {YARN_JAR_URL} from "../config.js";
import error from "../utils/error.js";
import type JSZipType from "jszip";
import parseMappings, {Mappings} from "./parseMappings.js";

declare const JSZip: JSZipType;

// Enrich Mappings type with source info
export type DownloadedMappings = {
    yarnVersion: string;
    url: string;
} & Mappings;

async function downloadMappings(version: YarnVersionJson, statusCallback: (status: string) => void): Promise<DownloadedMappings> {

    const yarnVersion = version.gameVersion + version.separator + version.build;
    const url = `${YARN_JAR_URL}/${yarnVersion}/yarn-${yarnVersion}-v2.jar`;

    statusCallback(`Requesting ${url}...`);

    const response = await fetch(url);

    if (!response.ok || !response.body) {
        console.error("Failed to download Yarn mappings: ", response);
        error("Failed to download Yarn mappings from " + url);
    }

    statusCallback(`Downloading ${url}...`);

    const jarContent = await response.arrayBuffer();

    statusCallback(`Downloaded ${jarContent.byteLength} bytes. Reading ZIP-file...`);

    const zip = await new JSZip().loadAsync(jarContent);

    const mappingsZipEntry = zip.file("mappings/mappings.tiny")
    if (!mappingsZipEntry) {
        error("Downloaded mappings file is missing mappings.tiny");
    }

    const mappingFileContent: string = await mappingsZipEntry.async("string");

    const mappings = parseMappings(mappingFileContent);

    return {
        yarnVersion,
        url,
        ...mappings
    };

}

export default downloadMappings;

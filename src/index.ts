import getYarnVersions from "./getYarnVersions.js";
import YarnVersions from "./YarnVersions.js";
import error from "./error.js";
import {YarnVersionJson} from "./YarnVersionsJson";
import downloadMappings from "./downloadMappings.js";
import {Mappings} from "./parseMappings.js";
import mapLog from "./mapLog.js";

let mainContainer: HTMLElement;

/**
 * Retrieve a template from the document.
 */
function template(id: string): DocumentFragment {
    const el = document.getElementById(id);
    if (el instanceof HTMLTemplateElement) {
        return <DocumentFragment>el.content.cloneNode(true);
    }
    error(`Template ${id} not found`);
}

/**
 * Show the given document fragment as the main view.
 */
function show(tpl: DocumentFragment) {
    mainContainer.innerHTML = '';
    mainContainer.appendChild(tpl);
}

function showMappingInput(version: YarnVersionJson, mappings: Mappings) {

    const tpl = template('mapping-input');
    const textarea = tpl.querySelector("textarea")!!;
    const button = tpl.querySelector("button")!!;

    button.addEventListener("click", () => {
        const {
            mappedLog, classesMapped, methodsMapped, fieldsMapped
        } = mapLog(textarea.value, mappings);
        alert(`Mapped!\n\nClasses: ${classesMapped}\nMethods: ${methodsMapped}\nFields: ${fieldsMapped}`);
        textarea.value = mappedLog;
    });

    show(tpl);

}

async function showDownloadPage(version: YarnVersionJson) {
    // Show a loading screen
    const loadingTpl = template('loading-mappings');
    const statusLabel = loadingTpl.querySelector(".status")!!;
    show(loadingTpl);

    const mappings = await downloadMappings(version, status => statusLabel.textContent = status);

    showMappingInput(version, mappings);
}

function showVersionSelect(yarnVersions: YarnVersions) {
    const tpl = template('version-select');
    const select = tpl.querySelector("select")!!;
    for (let gameVersion of yarnVersions.gameVersions) {
        const opt = document.createElement("option");
        opt.text = gameVersion.version;
        select.options.add(opt);
    }

    tpl.querySelector("button")!!.addEventListener("click", () => {
        const selectedGameVersion = select.selectedOptions.item(0)?.value;
        if (selectedGameVersion) {
            const yarnVersion = yarnVersions.getYarnForGameVersion(selectedGameVersion);
            showDownloadPage(yarnVersion).catch(error);
        }
    });

    show(tpl);
}

async function init() {
    showVersionSelect(await getYarnVersions());
}

window.addEventListener("DOMContentLoaded", () => {
    let container = document.getElementById("main");
    if (!container) {
        error("Failed to find main container");
    }
    mainContainer = container;

    init().catch(error);
});

import {DownloadedMappings} from "../mapping/downloadMappings.js";
import {show, template} from "../utils/mainView.js";
import mapLog from "../mapping/mapLog.js";

function showMappingView(mappings: DownloadedMappings) {

    const tpl = template('mapping-input');
    const textarea = tpl.querySelector("textarea")!!;
    const mappingResultLabel = tpl.querySelector(".mapping-result")!!;
    const mapButton = tpl.querySelector("button.map")!! as HTMLButtonElement;
    const copyButton = tpl.querySelector("button.copy")!! as HTMLButtonElement;
    const setMappingInfo = (field: string, text: string) => {
        const label = tpl.querySelector(`.mapping-info .${field}`)!!;
        label.textContent = text;
    };

    // Show some stats about the Yarn mappings we're using
    const yarnLink = tpl.querySelector("a.yarn-version")!!;
    yarnLink.setAttribute("href", mappings.url);
    yarnLink.textContent = "Yarn " + mappings.yarnVersion;

    setMappingInfo('classes', mappings.classes.size.toString());
    setMappingInfo('methods', mappings.methods.size.toString());
    setMappingInfo('fields', mappings.fields.size.toString());

    // Clear the status-line if the user changes the input, and make the buttons disabled/enabled based on
    // the text field's content
    const clearStatus = () => {
        mappingResultLabel.textContent = '';
        mapButton.disabled = textarea.value.trim() === '';
        copyButton.disabled = textarea.value.trim() === '';
    };
    textarea.addEventListener("keydown", clearStatus);
    textarea.addEventListener("keyup", clearStatus);
    textarea.addEventListener("change", clearStatus);
    clearStatus();

    // Perform the actual remapping
    mapButton.addEventListener("click", () => {
        const {
            mappedLog, classesMapped, methodsMapped, fieldsMapped
        } = mapLog(textarea.value, mappings);
        textarea.value = mappedLog;

        mappingResultLabel.textContent = `Mapped! - Classes: ${classesMapped} Methods: ${methodsMapped} Fields: ${fieldsMapped}`;
    });

    // Copy to clipboard
    copyButton.addEventListener("click", () => {
        textarea.select();
        document.execCommand('copy');
        mappingResultLabel.textContent = 'Copied to clipboard!';
    });

    show(tpl);

}

export default showMappingView;

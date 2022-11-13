/*! domfiles v0.1.0 | MIT | https://github.com/hd-code/typescript-snippets */

/**
 * Download and upload data from and to data files in the browser.
 * @module domfiles
 */

/** Download a string of data from the browser into a data file. */
export function download(data: string, filename = "data.txt"): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!data || typeof data !== "string") {
            reject("Data to save was either empty or not a string");
            return;
        }

        const link = document.createElement("a");
        link.href = "data:text/plain;charset=utf-8," + encodeURI(data);
        link.setAttribute("download", filename);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        link.remove();

        resolve();
    });
}

/** Open a data file in the browser. */
export function openFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!window.FileReader) {
            reject("This Browser does not support uploading files!");
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = () => {
            let data = "";
            if (fileReader.result instanceof ArrayBuffer) {
                const dec = new TextDecoder("utf-8");
                data = dec.decode(fileReader.result);
            } else {
                data = fileReader.result || "";
            }
            resolve(data);
        };

        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.addEventListener("change", () => {
            const files = input.files;
            if (!files || files.length === 0) {
                return;
            }
            fileReader.readAsText(files[0] as File);
        });
        input.click();
        input.remove();
    });
}

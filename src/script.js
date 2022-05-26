// TODO:
// 1. move the folter into Sketch folder
// 2. name of the JSON file = name of the selected layer
// 3. add to Sketch automatically

var { isNativeObject } = require("util");
const fs = require("@skpm/fs");
const os = require("os");
const path = require("path");
const desktopDir = path.join(os.homedir(), "Desktop");

const dataFolder = desktopDir + "/sketch-data";
const imagesFolder = dataFolder + "/Images";

var imagesArray = [];
var imagesExportedArray = [];

createFolder(dataFolder);
createFolder(imagesFolder);

// General variables

// #region Sketch Items
var sketch = require("sketch");

// Document variables
var document = sketch.getSelectedDocument();
const exportOptions = {
    formats: "png",
    overwriting: true,
    output: imagesFolder,
};
// #endregion

export default function () {
    const { getSelectedDocument, Style } = require("sketch");
    const { message } = require("sketch/ui");

    function isLayerGroup(tbc) {
        return "type" in tbc && tbc.type == "Group";
    }

    let doc = getSelectedDocument();

    if (doc.selectedLayers.length !== 1) {
        message("☝️ Select exactly one layer group to create data set.");
        return;
    }

    let selected = doc.selectedLayers.layers[0];

    const toData = (layer) => {
        let parent = document.selectedLayers.layers[0].parent;
        let name = layer.name;
        switch (layer.type) {
            // text layers use the value
            case "Text":
                return layer.text;

            case "Image":
                let currentImage = extractImages(layer, name, parent);
                return currentImage;

            // symbol instances can have override values
            case "SymbolInstance":
            case "SymbolMaster":
                // ensure overrides for nested symbols won't be processed before the
                // actual symbol override and filter out any override values that cannot
                // be used with data
                let supportedProperties = ["symbolID", "stringValue", "image"];
                let overrides = layer.overrides
                    .sort((a, b) => a.path.localeCompare(b.path))
                    .filter((val) =>
                        supportedProperties.includes(val.property)
                    );

                var data = {};
                var dataGroupByPath = { "": data };
                var hasValues = false;
                for (const o of overrides) {
                    let pathComponents = o.path.split("/");
                    pathComponents.pop();
                    let parentPath = pathComponents.join("/");
                    let affectedLayerName = o.affectedLayer.name;

                    if (o.property === "symbolID") {
                        dataGroupByPath[o.path] = {};
                        dataGroupByPath[parentPath][affectedLayerName] =
                            dataGroupByPath[o.path];
                        continue;
                    }

                    dataGroupByPath[parentPath][o.affectedLayer.name] =
                        o.property === "image"
                            ? symbolImages(layer, affectedLayerName)
                            : o.value;
                    hasValues = true;
                }
                // We need to remove the nodes that don't have any values
                data = removeEmptyNodes(data);

                return hasValues ? data : undefined;

            // other layers can have image fills, in case of multiple image fills only
            default:
                let fills = layer.style.fills;
                for (let n = 0; n < fills.length; n++) {
                    let currentFill = fills[n];
                    if (currentFill.fillType === "Pattern") {
                        let currentImage = extractImages(layer, name, parent);
                        return currentImage;
                    } else {
                        break;
                    }
                }
        }
        return undefined;
    };

    const walk = (layer, extract, initialValue) => {
        if (!isLayerGroup(layer)) {
            return extract(layer);
        }

        var value = initialValue;
        for (const l of Array.from(layer.layers).reverse()) {
            // layer groups can only create nested data objects, not values
            let v;
            if (isLayerGroup(l)) {
                v = walk(l, toData, undefined);
            } else {
                v = extract(l);
            }

            if (v === undefined) continue;
            value = { ...value, [l.name]: v };
        }

        return value;
    };

    let data = walk(selected, toData, undefined);

    // `data` can be `undefined` if the symbol overrides
    // in the selected layer are disabled
    if (data === undefined) {
        message("☝️ No symbol overrides found.");
    } else {
        let json = JSON.stringify([data], null, 2);

        console.log(json);

        // Finally, store the information in a `dat.json` file:
        try {
            fs.writeFileSync(dataFolder + "/data.json", json);
            sketch.UI.message("✅ Link Data extraction complete");
        } catch (error) {
            sketch.UI.message(
                "⛔️ There was an error writing your file on Desktop"
            );
        }
    }
}

// **************************************
// Script functions
// **************************************
function createFolder(folder) {
    try {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    } catch (err) {
        console.error(err);
    }
}

function extractImages(layer, name, parent) {
    let layerParent = parent;
    var image = sketch.Image;
    var ShapePath = sketch.ShapePath;
    var Style = sketch.Style;
    var Rectangle = sketch.Rectangle;

    var selectedLayer = layer;
    var selectedLayerName = name;
    selectedLayerName = selectedLayerName.replace(/\s/g, "-");
    selectedLayerName = selectedLayerName.replace(/\_+/g, "-");
    selectedLayerName = selectedLayerName.replace(/\/+/g, "-");
    selectedLayerName = selectedLayerName.replace(/\-+/g, "-").toLowerCase();

    if (imagesArray.length > 0) {
        for (let n = 0; n < imagesArray.length; n++) {
            if (selectedLayerName === imagesArray[n]) {
                selectedLayerName += (n + 1).toString();
            }
        }
    }
    imagesArray.push(selectedLayerName);
    let extractedImage;
    if (layer.type === "Image") {
        extractedImage = selectedLayer.image.nsimage;
    } else {
        extractedImage = selectedLayer.style.fills[0].pattern.image.nsimage;
    }
    var image = extractedImage;

    let rectangle = new ShapePath({
        name: selectedLayerName,
        frame: new Rectangle(selectedLayer.frame),
        style: {
            fills: [
                {
                    fill: "Pattern",
                    pattern: {
                        patternType: Style.PatternFillType.Fill,
                        image: image,
                    },
                },
            ],
        },
        parent: layerParent,
    });

    let nsImage;

    if (isNativeObject(image)) {
        if (image.isKindOfClass(NSImage)) {
            nsImage = image;
        } else if (image.isKindOfClass(NSData)) {
            nsImage = NSImage.alloc().initWithData(image);
        } else if (image.isKindOfClass(NSURL)) {
            nsImage = NSImage.alloc().initWithContentsOfURL(image);
        } else if (image.isKindOfClass(MSImageData)) {
            return ImageData.fromNative(image);
        } else {
            throw new Error(
                `Cannot create an image from a ${String(image.class())}`
            );
        }
    } else if (typeof image === "string" || (image && image.path)) {
        nsImage = NSImage.alloc().initByReferencingFile(image.path || image);
    } else if (image && image.base64) {
        try {
            const data = NSData.alloc().initWithBase64EncodedString_options(
                image.base64,
                NSDataBase64DecodingIgnoreUnknownCharacters
            );
            nsImage = NSImage.alloc().initWithData(data);
        } catch (err) {
            throw new Error(err);
        }
    } else if (Buffer.isBuffer(image)) {
        nsImage = NSImage.alloc().initWithData(image.toNSData());
    } else {
        throw new Error("`image` needs to be a Buffer");
    }

    // if (!(imagesArray.length > 0 && imagesArray.includes(selectedLayerName))) {
    //     sketch.export(rectangle, exportOptions);
    //     imagesArray.push(selectedLayerName);
    // }
    sketch.export(rectangle, exportOptions);

    rectangle.remove();

    return "images/" + selectedLayerName + ".png";
}

function symbolImages(layer, layerName) {
    let group;
    if (layer.type === "SymbolInstance") {
        group = layer.duplicate().detach();
        group.name = "Group-" + layerName;
    } else if (layer.type === "SymbolMaster") {
        group = layer;
    }
    let affectedLayerName = layerName;
    let currentImage;
    for (let l = 0; l < group.layers.length; l++) {
        let currentLayer = group.layers[l];
        if (
            currentLayer.type === "Image" &&
            currentLayer.name === affectedLayerName
        ) {
            currentImage = extractImages(
                currentLayer,
                affectedLayerName,
                group
            );
        } else if (
            currentLayer.type === "ShapePath" &&
            currentLayer.name === affectedLayerName
        ) {
            let fills = currentLayer.style.fills;
            for (let n = 0; n < fills.length; n++) {
                let currentFill = fills[n];
                if (currentFill.fillType === "Pattern") {
                    currentImage = extractImages(
                        currentLayer,
                        affectedLayerName,
                        group
                    );
                }
            }
        } else if (
            currentLayer.type === "SymbolInstance" &&
            currentLayer.name === affectedLayerName
        ) {
            currentImage = symbolImages(currentLayer, currentLayer.name);
        } else if (currentLayer.type === "Group") {
            let currentGroupLayers = currentLayer.layers;
            for (let cgl = 0; cgl < currentGroupLayers.length; cgl++) {
                if (currentGroupLayers[cgl].name === affectedLayerName) {
                    currentImage = extractImages(
                        currentGroupLayers[cgl],
                        currentGroupLayers[cgl].name,
                        currentLayer
                    );
                }
            }
        }
    }
    if (layer.type === "SymbolInstance") {
        group.remove();
    }

    return currentImage;
}

// **************************************
// Object functions
// **************************************

function removeEmptyNodes(obj) {
    let hasEmptyNodes = false;
    Object.entries(obj).forEach(([key, value]) => {
        if (Object.keys(value).length === 0) {
            delete obj[key];
            hasEmptyNodes = true;
        } else if (typeof value === "object") {
            obj[key] = removeEmptyNodes(value);
        }
    });
    return hasEmptyNodes ? removeEmptyNodes(obj) : obj;
}

/**
 * Return true if item exist in a
 * multidimentional array
 */
function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true; // Found it
        }
    }
    return false; // Not found
}

/**
 * Set all keys and values to LowerCase in object
 */
function objectectLowerCase(object) {
    // Helper function for detection objects
    const isObject = (obj) =>
        Object.prototype.toString.call(obj) === "[object Object]";

    // The entry point for recursion, iterates and maps object properties
    const lowerCaseObjectKeys = (obj) =>
        Object.fromEntries(Object.entries(obj).map(objectKeyMapper));

    // Converts keys to lowercase, detects object values
    // and sends them off for further conversion
    const objectKeyMapper = ([key, val]) => [
        key.toLowerCase(),
        isObject(val) ? lowerCaseObjectKeys(val) : val,
    ];

    let newObject = lowerCaseObjectKeys(lowercaseObjectValues(object));

    return newObject;
}

/**
 * Set all values to LowerCase in object
 */
function lowercaseObjectValues(object) {
    if (typeof object === "object") {
        for (var keys in object) {
            if (typeof object[keys] === "object") {
                lowercaseObjectValues(object[keys]);
            } else {
                let keyValue = object[keys];
                if (typeof keyValue === "string") {
                    keyValue = object[keys].toLowerCase();
                    object[keys] = keyValue;
                }
            }
        }
    }
    return object;
}

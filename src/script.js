import rgbHex from "rgb-hex";
import hexRgb from "hex-rgb";
import { isDeepStrictEqual } from "util";

import { resolve } from "path";
const fs = require("@skpm/fs");
const os = require("os");
const path = require("path");
const desktopDir = path.join(os.homedir(), "Desktop");

// import config from "./config.json";

// General variables
var parentPath = [];
const variablePrefix = "$";
const keyToDelete = "length";
const separator = "-";
var result = "";
var colors = [];
var externalShadows = [];
var internalShadows = [];
var gradients = [];
var fontSizes = [];

// #region Sketch Items
var sketch = require("sketch");
var Image = require("sketch/dom").Image;

// Document variables
var doc = context.document;
var document = sketch.getSelectedDocument();
var artboard = sketch.Artboard;
var data = document.sketchObject.documentData();
var image = sketch.Image;
// #endregion

export default function() {
    const { getSelectedDocument, Style } = require("sketch");
    const { message } = require("sketch/ui");

    function isLayerGroup(tbc) {
        return "type" in tbc && tbc.type == "Group";
    }

    const toData = (layer) => {
        switch (layer.type) {
            // text layers use the value
            case "Text":
                return layer.text;

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

                    if (o.property === "symbolID") {
                        dataGroupByPath[o.path] = {};
                        dataGroupByPath[parentPath][o.affectedLayer.name] =
                            dataGroupByPath[o.path];
                        continue;
                    }

                    dataGroupByPath[parentPath][o.affectedLayer.name] =
                        o.property === "image" ? "/path/to/image.png" : o.value;
                    hasValues = true;
                }
                // We need to remove the nodes that don't have any values
                data = removeEmptyNodes(data);

                return hasValues ? data : undefined;

                // other layers can have image fills, in case of multiple image fills only
                // the last one is used as override value
            default:
                let hasImageFill = layer.style ? .fills.reduce((prev, curr) => {
                    if (curr.type !== Style.FillType.Pattern) return prev;
                    return true;
                }, false);

                if (!hasImageFill) break;
                return "/path/to/image.png"; // actual image not exported, placeholder instead
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
            let v = isLayerGroup(l) ?
                walk(l.layers, extract, undefined) :
                extract(l);
            if (v === undefined) continue;
            value = {...value, [l.name]: v };
        }
        return value;
    };

    let doc = getSelectedDocument();

    if (doc.selectedLayers.length !== 1) {
        message("☝️ Select exactly one layer group to create data set.");
        return;
    }

    let selected = doc.selectedLayers.layers[0];

    let data = walk(selected, toData, undefined);

    // `data` can be `undefined` if the symbol overrides
    // in the selected layer are disabled
    if (data === undefined) {
        message("☝️ No symbol overrides found.");
    } else {
        // wrap data in array before encoding as JSON because Sketch expects a
        // set of values, not a single object
        // let json = JSON.stringify([data], null, 2);

        // // use native macOS pasteboard APIs to copy the JSON so it can be easily
        // // pasted outside Sketch
        // let pasteboard = NSPasteboard.generalPasteboard();
        // pasteboard.clearContents();
        // pasteboard.setString_forType(json, NSPasteboardTypeString);

        // message("📋 Data copied to clipboard.");

        let json = JSON.stringify(objectectLowerCase([data]), null, 2);

        // Finally, store the color information in a `colors.json` file:
        try {
            fs.writeFileSync(desktopDir + "/data.json", json);
            sketch.UI.message("✅ Design Tokens extraction complete");
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

/**
 * Get the key in the object associated with the defined value
 * The discard parameter permit to remove part of the value string if needed
 */
function getKeyByValue(object, value, discard = "") {
    if (typeof value === "string") {
        value = value.replace(discard, "");
    }
    return Object.keys(object).find((key) => object[key] === value);
}

/**
 * Generate nested Objects by splitting a sting
 * Usages:
 * createNestedObject(window, ['shapes', 'circle'])
 *   Now window.shapes.circle is an empty object, ready to be used.
 * var object = {} // Works with any object other that window too
 * createNestedObject(object, ['shapes', 'rectangle', 'width'], 300)
 *   Now we have: object.shapes.rectangle.width === 300
 * createNestedObject(object, 'shapes.rectangle.height'.split('.'), 400)
 *   Now we have: object.shapes.rectangle.height === 400
 */
function createNestedObject(object, keys, value) {
    // If a value is given, remove the last name and keep it for later:
    var lastKey = arguments.length === 3 ? keys.pop() : false;
    // Walk the hierarchy, creating new objects where needed.
    // If the lastKey was removed, then the last object is not set yet:
    for (var i = 0; i < keys.length; i++) {
        object = object[keys[i]] = object[keys[i]] || {};
    }

    // If a value was given, set it to the last name:
    if (lastKey) object = object[lastKey] = value;

    // Return the last object in the hierarchy:
    return object;
}

/**
 * Check if an object is empy
 */
function isEmptyObj(object) {
    let isEmpty = false;
    if (Object.keys(object).length === 0) {
        isEmpty = true;
    }
    return isEmpty;
}
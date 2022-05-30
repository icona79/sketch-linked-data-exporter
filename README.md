# Sketch Link Data Manager

The plugin exports a JSON file from your selected `Group`, `Symbol` or `Symbol Instance`. The JSON is ready to be used with the Sketch native function `Linked Data` ([Documentation here](https://www.sketch.com/docs/designing/data/#linked-data)).

`Linked Data` permits to handle Text values and Images. This plugin generates a JSON dictionary that contains all the available (and overrideable) text layers values and images. The JSON file (named after the selected layer) and it Images are stored into a `Lined-Data` folder available inside your Sketch folder.

As soon as you export your dataset, it becomes automatically available in your data set list.

## Aknowledgments

Thanks to [Ale Munoz](https://github.com/bomberstudios) and [Francesco Bertocci](https://github.com/fbmore) for all their support :pray:

Thanks to [Christian Klotz](https://github.com/christianklotz) and [Ashung](https://github.com/Ashung) for their work on the code. You can find the original code from Christian Klotz [here](https://links.gratton.design/blog-deep-dive-linked-data)

## Installation

-   [Download](../../releases/latest/download/sketch-tokens-exporter.sketchplugin.zip) the latest release of the plugin
-   Un-zip
-   Double-click on sketch-tokens-exporter.sketchplugin

## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

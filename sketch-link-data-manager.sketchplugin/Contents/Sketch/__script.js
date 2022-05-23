var globalThis = this;
var global = this;
function __skpm_run (key, context) {
  globalThis.context = context;
  try {

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/src/script.js: Unexpected token (92:49)\n\n\u001b[0m \u001b[90m 90 |\u001b[39m                 \u001b[90m// the last one is used as override value\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 91 |\u001b[39m             \u001b[36mdefault\u001b[39m\u001b[33m:\u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 92 |\u001b[39m                 \u001b[36mlet\u001b[39m hasImageFill \u001b[33m=\u001b[39m layer\u001b[33m.\u001b[39mstyle \u001b[33m?\u001b[39m \u001b[33m.\u001b[39mfills\u001b[33m.\u001b[39mreduce((prev\u001b[33m,\u001b[39m curr) \u001b[33m=>\u001b[39m {\u001b[0m\n\u001b[0m \u001b[90m    |\u001b[39m                                                  \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 93 |\u001b[39m                     \u001b[36mif\u001b[39m (curr\u001b[33m.\u001b[39mtype \u001b[33m!==\u001b[39m \u001b[33mStyle\u001b[39m\u001b[33m.\u001b[39m\u001b[33mFillType\u001b[39m\u001b[33m.\u001b[39m\u001b[33mPattern\u001b[39m) \u001b[36mreturn\u001b[39m prev\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 94 |\u001b[39m                     \u001b[36mreturn\u001b[39m \u001b[36mtrue\u001b[39m\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 95 |\u001b[39m                 }\u001b[33m,\u001b[39m \u001b[36mfalse\u001b[39m)\u001b[33m;\u001b[39m\u001b[0m\n    at instantiate (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:72:32)\n    at constructor (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:358:12)\n    at Object.raise (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:3335:19)\n    at Object.unexpected (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:3373:16)\n    at Object.parseExprAtom (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:13015:22)\n    at Object.parseExprAtom (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:8034:20)\n    at Object.parseExprSubscripts (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:12540:23)\n    at Object.parseUpdate (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:12519:21)\n    at Object.parseMaybeUnary (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:12490:23)\n    at Object.parseMaybeUnaryOrPrivate (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:12284:61)\n    at Object.parseExprOps (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:12291:23)\n    at Object.parseMaybeConditional (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:12261:23)\n    at Object.parseMaybeAssign (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:12214:21)\n    at /Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:12172:39\n    at Object.allowInAnd (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:14242:12)\n    at Object.parseMaybeAssignAllowIn (/Users/matteogratton/Documents/Sketch/Plugin/Sketch-Linked-Data-Manager/sketch-linked-data-manager/node_modules/@babel/parser/lib/index.js:12172:17)");

/***/ })

/******/ });
    if (key === 'default' && typeof exports === 'function') {
      exports(context);
    } else if (typeof exports[key] !== 'function') {
      throw new Error('Missing export named "' + key + '". Your command should contain something like `export function " + key +"() {}`.');
    } else {
      exports[key](context);
    }
  } catch (err) {
    if (typeof process !== 'undefined' && process.listenerCount && process.listenerCount('uncaughtException')) {
      process.emit("uncaughtException", err, "uncaughtException");
    } else {
      throw err
    }
  }
}
globalThis['onRun'] = __skpm_run.bind(this, 'default');
globalThis['onShutdown'] = __skpm_run.bind(this, 'onShutdown')

//# sourceMappingURL=__script.js.map
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup.ts":
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PopupManager {
    constructor() {
        this.isConnected = false;
        this.statusElement = document.getElementById('status');
        this.buttonElement = document.getElementById('openTerminal'); // Cast a HTMLButtonElement
        this.init();
    }
    init() {
        this.checkConnectionStatus();
        this.setupListeners();
    }
    checkConnectionStatus() {
        fetch('http://localhost:8000')
            .then(() => this.updateStatus(true))
            .catch(() => this.updateStatus(false));
    }
    updateStatus(connected) {
        this.isConnected = connected;
        if (this.statusElement) {
            this.statusElement.textContent = connected ?
                'Connected to Terminal Fusion Server' :
                'Server disconnected';
            this.statusElement.className = `status ${connected ? 'connected' : 'disconnected'}`;
        }
        if (this.buttonElement) {
            this.buttonElement.disabled = !connected; // Ahora funciona porque buttonElement es HTMLButtonElement
        }
    }
    setupListeners() {
        var _a;
        (_a = this.buttonElement) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const [tab] = yield chrome.tabs.query({ active: true, currentWindow: true });
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, { action: 'toggleTerminal' });
            }
        }));
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/popup.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=popup.js.map
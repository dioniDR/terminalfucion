/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

class WebSocketManager {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.connect();
    }
    connect() {
        try {
            this.socket = new WebSocket('ws://localhost:8000/ws');
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onerror = this.handleError.bind(this);
        }
        catch (error) {
            console.error('Error creating WebSocket:', error);
            this.updateStatus(false);
        }
    }
    handleOpen() {
        console.log('Connected to Terminal Fusion server');
        this.updateStatus(true);
    }
    handleClose() {
        console.log('Disconnected from server');
        this.updateStatus(false);
        setTimeout(() => this.connect(), 5000);
    }
    handleMessage(event) {
        console.log('Received:', event.data);
    }
    handleError(error) {
        console.error('WebSocket error:', error);
        this.updateStatus(false);
    }
    updateStatus(connected) {
        this.isConnected = connected;
        chrome.runtime.sendMessage({
            type: 'connectionStatus',
            isConnected: connected
        }).catch(error => {
            console.error('Error sending message:', error);
        });
    }
    getStatus() {
        return this.isConnected;
    }
}
const wsManager = new WebSocketManager();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getConnectionStatus') {
        sendResponse({ isConnected: wsManager.getStatus() });
    }
    return true;
});

/******/ })()
;
//# sourceMappingURL=background.js.map
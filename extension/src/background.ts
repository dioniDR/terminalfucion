class WebSocketManager {
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;

    constructor() {
        this.connect();
    }

    private connect(): void {
        try {
            this.socket = new WebSocket('ws://localhost:8000/ws');
            
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onerror = this.handleError.bind(this);
        } catch (error) {
            console.error('Error creating WebSocket:', error);
            this.updateStatus(false);
        }
    }

    private handleOpen(): void {
        console.log('Connected to Terminal Fusion server');
        this.updateStatus(true);
    }

    private handleClose(): void {
        console.log('Disconnected from server');
        this.updateStatus(false);
        setTimeout(() => this.connect(), 5000);
    }

    private handleMessage(event: MessageEvent): void {
        console.log('Received:', event.data);
    }

    private handleError(error: Event): void {
        console.error('WebSocket error:', error);
        this.updateStatus(false);
    }

    private updateStatus(connected: boolean): void {
        this.isConnected = connected;
        chrome.runtime.sendMessage({
            type: 'connectionStatus',
            isConnected: connected
        }).catch(error => {
            console.error('Error sending message:', error);
        });
    }

    public getStatus(): boolean {
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

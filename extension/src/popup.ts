class PopupManager {
  private statusElement: HTMLElement | null;
  private buttonElement: HTMLButtonElement | null;  // Cambiado a HTMLButtonElement
  private isConnected: boolean = false;

  constructor() {
    this.statusElement = document.getElementById('status');
    this.buttonElement = document.getElementById('openTerminal') as HTMLButtonElement;  // Cast a HTMLButtonElement
    this.init();
  }

  private init(): void {
    this.checkConnectionStatus();
    this.setupListeners();
  }

  private checkConnectionStatus(): void {
    fetch('http://localhost:8000')
      .then(() => this.updateStatus(true))
      .catch(() => this.updateStatus(false));
  }

  private updateStatus(connected: boolean): void {
    this.isConnected = connected;
    if (this.statusElement) {
      this.statusElement.textContent = connected ? 
        'Connected to Terminal Fusion Server' : 
        'Server disconnected';
      this.statusElement.className = `status ${connected ? 'connected' : 'disconnected'}`;
    }
    if (this.buttonElement) {
      this.buttonElement.disabled = !connected;  // Ahora funciona porque buttonElement es HTMLButtonElement
    }
  }

  private setupListeners(): void {
    this.buttonElement?.addEventListener('click', async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'toggleTerminal' });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});

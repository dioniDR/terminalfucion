type Position = {
  x: number;
  y: number;
};

class TerminalOverlay {
  private container: HTMLDivElement = document.createElement('div');
  private header: HTMLDivElement = document.createElement('div');
  private iframe: HTMLIFrameElement = document.createElement('iframe');
  private resizer: HTMLDivElement = document.createElement('div');
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private dragOffset: Position = { x: 0, y: 0 };
  private initialSize: Position = { x: 0, y: 0 };

  constructor() {
    this.createContainer();
    this.createHeader();
    this.createIframe();
    this.createResizer();
    this.setupEventListeners();
  }

  private createContainer() {
    this.container.className = 'terminal-fusion-overlay';
    this.container.style.cssText = `
      position: fixed;
      top: 20%;
      left: 20%;
      width: 800px;
      height: 600px;
      background: #1a1b26;
      border: 1px solid #2f3242;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 999999;
      overflow: hidden;
      resize: both;
    `;
  }

  private createHeader() {
    this.header.className = 'terminal-fusion-header';
    this.header.style.cssText = `
      height: 32px;
      background: #16161e;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: move;
      user-select: none;
    `;

    const title = document.createElement('span');
    title.textContent = 'Terminal Fusion';
    title.style.cssText = `
      color: #7aa2f7;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
    `;

    const controls = document.createElement('div');
    controls.style.display = 'flex';

    const buttons = [
      { text: '−', action: () => this.minimize() },
      { text: '□', action: () => this.toggleMaximize() },
      { text: '×', action: () => this.close() }
    ];

    buttons.forEach(({ text, action }) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.style.cssText = `
        background: none;
        border: none;
        color: #7aa2f7;
        font-size: 16px;
        padding: 0 8px;
        cursor: pointer;
        height: 32px;
      `;
      button.onmouseover = () => {
        button.style.background = 'rgba(122, 162, 247, 0.1)';
      };
      button.onmouseout = () => {
        button.style.background = 'none';
      };
      button.onclick = action;
      controls.appendChild(button);
    });

    this.header.appendChild(title);
    this.header.appendChild(controls);
  }

  private createIframe() {
    this.iframe.src = 'http://localhost:5173';
    this.iframe.style.cssText = `
      width: 100%;
      height: calc(100% - 32px);
      border: none;
      background: #1a1b26;
    `;
  }

  private createResizer() {
    this.resizer.style.cssText = `
      position: absolute;
      right: 0;
      bottom: 0;
      width: 20px;
      height: 20px;
      cursor: se-resize;
    `;
  }

  private setupEventListeners() {
    this.header.onmousedown = (e) => {
      if (e.target === this.header) {
        this.isDragging = true;
        const rect = this.container.getBoundingClientRect();
        this.dragOffset = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    };

    this.resizer.onmousedown = (e) => {
      this.isResizing = true;
      this.initialSize = {
        x: this.container.offsetWidth,
        y: this.container.offsetHeight
      };
      e.stopPropagation();
    };

    document.onmousemove = (e) => {
      if (this.isDragging) {
        this.container.style.left = `${e.clientX - this.dragOffset.x}px`;
        this.container.style.top = `${e.clientY - this.dragOffset.y}px`;
      } else if (this.isResizing) {
        const width = this.initialSize.x + (e.clientX - this.initialSize.x);
        const height = this.initialSize.y + (e.clientY - this.initialSize.y);
        this.container.style.width = `${Math.max(400, width)}px`;
        this.container.style.height = `${Math.max(300, height)}px`;
      }
    };

    document.onmouseup = () => {
      this.isDragging = false;
      this.isResizing = false;
    };
  }

  public minimize() {
    this.container.style.height = '32px';
    this.iframe.style.display = 'none';
  }

  public maximize() {
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.iframe.style.display = 'block';
  }

  private isMaximized = false;

  public toggleMaximize() {
    if (this.isMaximized) {
      this.container.style.top = '20%';
      this.container.style.left = '20%';
      this.container.style.width = '800px';
      this.container.style.height = '600px';
    } else {
      this.maximize();
    }
    this.isMaximized = !this.isMaximized;
  }

  public restore() {
    this.container.style.height = '600px';
    this.iframe.style.display = 'block';
  }

  public close() {
    this.container.remove();
  }

  public mount() {
    document.body.appendChild(this.container);
    this.container.appendChild(this.header);
    this.container.appendChild(this.iframe);
    this.container.appendChild(this.resizer);
  }
}

// Comunicación con el background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleTerminal') {
    const terminal = new TerminalOverlay();
    terminal.mount();
  }
});

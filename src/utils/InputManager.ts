/**
 * Input manager for handling keyboard and mouse controls
 */
export class InputManager {
  private keys: Map<string, boolean>;
  private mousePosition: { x: number; y: number };
  private mouseButtons: Map<number, boolean>;

  constructor() {
    this.keys = new Map();
    this.mousePosition = { x: 0, y: 0 };
    this.mouseButtons = new Map();
    
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.code, true);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);
    });

    // Mouse events
    window.addEventListener('mousemove', (e) => {
      this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('mousedown', (e) => {
      this.mouseButtons.set(e.button, true);
    });

    window.addEventListener('mouseup', (e) => {
      this.mouseButtons.set(e.button, false);
    });
  }

  /**
   * Check if a key is currently pressed
   */
  public isKeyPressed(keyCode: string): boolean {
    return this.keys.get(keyCode) || false;
  }

  /**
   * Check if a mouse button is pressed
   */
  public isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons.get(button) || false;
  }

  /**
   * Get normalized mouse position (-1 to 1)
   */
  public getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  /**
   * Clear all input states
   */
  public clear(): void {
    this.keys.clear();
    this.mouseButtons.clear();
  }
}

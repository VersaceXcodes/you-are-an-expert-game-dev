export class InputManager {
  keys: { [key: string]: boolean } = {};
  mouse: { x: number; y: number; left: boolean } = { x: 0, y: 0, left: false };

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
  };

  handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  handleMouseMove = (e: MouseEvent) => {
    // We'll need to adjust for canvas offset if necessary, but for now global client coordinates
    // passed to update/draw will be mapped relative to canvas
  };

  setMousePos(x: number, y: number) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) this.mouse.left = true;
  };

  handleMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.mouse.left = false;
  };

  isKeyDown(code: string): boolean {
    return !!this.keys[code];
  }
}

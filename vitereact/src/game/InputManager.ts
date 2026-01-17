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
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
    this.keys[e.code] = true;
  };

  handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  handleMouseMove = (e: MouseEvent) => {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
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

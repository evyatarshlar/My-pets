// Interface for fireworks
export interface Fire {
  x: number;
  y: number;
  size: number;
  fill: string;
  vx: number;
  vy: number;
  ax: number;
  far: number;
  base: { x: number; y: number; vx: number };
}

export interface Firework {
  x: number;
  y: number;
  size: number;
  fill: string;
  vx: number;
  vy: number;
  ay: number;
  alpha: number;
  life: number;
  base: { life: number; size: number };
}

export class FireworkManager {
  private ctx!: CanvasRenderingContext2D;
  private listFire: Fire[] = [];
  private listFirework: Firework[] = [];
  private fireNumber: number = 10;
  private center!: { x: number; y: number };
  private range: number = 100;
  private fireworksActive: boolean = false;
  private canvas!: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = context;
    this.center = { x: canvas.width / 2, y: canvas.height / 2 };
    this.initFireworks();
  }

  // Initialize canvas dimensions
  onResize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // Initialize fireworks particles
  private initFireworks() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.fireNumber; i++) {
      const fire: Fire = {
        x: Math.random() * this.range / 2 - this.range / 4 + this.center.x,
        y: Math.random() * this.range * 2 + this.canvas.height,
        size: Math.random() + 0.5,
        fill: '#fd1',
        vx: Math.random() - 0.5,
        vy: -(Math.random() + 4),
        ax: Math.random() * 0.02 - 0.01,
        far: Math.random() * this.range + (this.center.y - this.range),
        base: { x: 0, y: 0, vx: 0 }
      };
      fire.base = { x: fire.x, y: fire.y, vx: fire.vx };
      this.listFire.push(fire);
    }
  }

  // Start fireworks animation
  startFireworks() {
    this.fireworksActive = true;
    this.startAnimation();
  }

  // Stop fireworks animation
  stopFireworks() {
    this.fireworksActive = false;
    // Clear canvas
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // Clear arrays
    this.listFire = [];
    this.listFirework = [];
    // Re-initialize for next time
    this.initFireworks();
  }

  // Generate random color
  private randColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Update fireworks physics
  private updateFireworks() {
    for (let i = 0; i < this.listFire.length; i++) {
      const fire = this.listFire[i];
      if (fire.y <= fire.far) {
        const color = this.randColor();
        for (let j = 0; j < this.fireNumber * 5; j++) {
          const firework: Firework = {
            x: fire.x,
            y: fire.y,
            size: Math.random() + 1.5,
            fill: color,
            vx: Math.random() * 5 - 2.5,
            vy: Math.random() * -5 + 1.5,
            ay: 0.05,
            alpha: 1,
            life: Math.round(Math.random() * this.range / 2) + this.range / 2,
            base: { life: 0, size: 0 }
          };
          firework.base = { life: firework.life, size: firework.size };
          this.listFirework.push(firework);
        }
        fire.y = fire.base.y;
        fire.x = fire.base.x;
        fire.vx = fire.base.vx;
        fire.ax = Math.random() * 0.02 - 0.01;
      }
      fire.x += fire.vx;
      fire.y += fire.vy;
      fire.vx += fire.ax;
    }

    for (let i = this.listFirework.length - 1; i >= 0; i--) {
      const firework = this.listFirework[i];
      if (firework) {
        firework.x += firework.vx;
        firework.y += firework.vy;
        firework.vy += firework.ay;
        firework.alpha = firework.life / firework.base.life;
        firework.size = firework.alpha * firework.base.size;
        firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;
        firework.life--;
        if (firework.life <= 0) {
          this.listFirework.splice(i, 1);
        }
      }
    }
  }

  // Draw fireworks on canvas
  private drawFireworks() {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.18;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 1;
    for (const fire of this.listFire) {
      ctx.beginPath();
      ctx.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = fire.fill;
      ctx.fill();
    }

    for (const firework of this.listFirework) {
      ctx.globalAlpha = firework.alpha;
      ctx.beginPath();
      ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = firework.fill;
      ctx.fill();
    }
  }

  // Animation loop
  private startAnimation() {
    const loop = () => {
      if (this.fireworksActive) {
        requestAnimationFrame(loop);
        this.updateFireworks();
        this.drawFireworks();
      }
    };
    loop();
  }

  // Check if fireworks are currently active
  isActive(): boolean {
    return this.fireworksActive;
  }

  // Get current fireworks count for debugging
  getFireworksCount(): { fires: number; fireworks: number } {
    return {
      fires: this.listFire.length,
      fireworks: this.listFirework.length
    };
  }
}

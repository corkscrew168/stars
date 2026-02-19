import {
  ScreenElement,
  Color,
  Vector,
  PointerEvent,
  Engine,
  Actor,
  Polygon,
  vec,
} from "excalibur";

/* ================================
   🎮 モバイルコントローラー
================================ */
export class MobileController {
  moveDir: Vector = Vector.Zero;
  jumpPressed = false;

  reset() {
    this.moveDir = Vector.Zero;
    this.jumpPressed = false;
  }
}

/* ================================
   ⭐ 五芒星生成関数
================================ */
function createStar(radius: number, color: Color) {
  const points: Vector[] = [];
  const spikes = 5;
  const outer = radius;
  const inner = radius * 0.45;

  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI / spikes) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    points.push(vec(Math.cos(angle) * r, Math.sin(angle) * r));
  }

  return new Polygon({
    points,
    color,             // 塗りありで拡大しても荒くならない
    strokeColor: Color.Transparent,
  });
}

/* ================================
   ✨ 小さい星（スワイプ・タップ用）
================================ */
class SmallStar extends Actor {
  private life = 1;

  constructor(pos: Vector) {
    super({ pos: pos.clone() });

    const color = Color.fromRGB(230, 240, 255);
    const star = createStar(6 + Math.random() * 2, color);

    this.graphics.use(star);
    this.z = 500;

    // ゆっくり漂う
    this.vel = vec((Math.random() - 0.5) * 0.9, -0.6);
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    this.life -= 0.006;
    const scaleAmount = 1 + (1 - this.life) * 1.5; // 控えめスケール
    this.scale = vec(scaleAmount, scaleAmount);

    this.graphics.opacity = this.life * this.life;

    if (this.life <= 0) this.kill();
  }
}

/* ================================
   🌟 大きい星（長押し用・荒くならない）
================================ */
class BigStar extends Actor {
  private life = 1;

  constructor(pos: Vector) {
    super({ pos: pos.clone() });

    const color = Color.fromRGB(255, 240, 200);

    // ⭐ 最初から大きめの塗りポリゴン（荒くならない）
    const star = createStar(40, color); // 40pxで大きく作る
    this.graphics.use(star);
    this.z = 450;
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    this.life -= 0.01;

    // スケールは控えめで最大1.5倍程度
    const scaleAmount = 1 + (1 - this.life) * 0.5;
    this.scale = vec(scaleAmount, scaleAmount);

    this.graphics.opacity = this.life;

    if (this.life <= 0) this.kill();
  }
}

/* ================================
   🎮 コントロールUI
================================ */
export class ControlUI extends ScreenElement {
  private controller: MobileController;
  private activePointerId: number | null = null;
  private touchCenter = Vector.Zero;
  private lastPos = Vector.Zero;

  private moved = false;
  private holdTimer = 0;
  private holding = false;

  // ⭐ 星出し制御（密度調整）
  private starCooldown = 0;

  public enabled = false;

  constructor(controller: MobileController, game: Engine) {
    const UI_WIDTH = 370;
    const UI_HEIGHT = 620;

    super({
      x: (game.screen.drawWidth - UI_WIDTH) / 2,
      y: game.screen.drawHeight - UI_HEIGHT - 20,
      width: UI_WIDTH,
      height: UI_HEIGHT,
      color: Color.fromRGB(15, 15, 20, 0.45),
    });

    this.controller = controller;
    this.z = 100;
    this.anchor = vec(0, 0);
  }

  onInitialize(engine: Engine) {
    this.on("pointerdown", (e: PointerEvent) => {
      if (!this.enabled) return;
      if (this.activePointerId !== null) return;

      this.activePointerId = e.pointerId;
      this.touchCenter = e.screenPos.clone();
      this.lastPos = e.screenPos.clone();

      this.moved = false;
      this.holdTimer = 0;
      this.holding = true;
    });

    this.on("pointermove", (e: PointerEvent) => {
      if (!this.enabled) return;
      if (e.pointerId !== this.activePointerId) return;

      const current = e.screenPos.clone();
      const dist = current.sub(this.lastPos).size;

      if (dist > 8 && this.starCooldown <= 0) {
        this.moved = true;
        const world = engine.screenToWorldCoordinates(current);
        engine.add(new SmallStar(world));

        this.lastPos = current;
        this.starCooldown = 4;
      }

      this.updateDirection(current);
    });

    this.on("pointerup", (e: PointerEvent) => {
      if (!this.enabled) return;
      if (e.pointerId !== this.activePointerId) return;

      // タップ判定
      if (!this.moved && this.holdTimer < 25) {
        const world = engine.screenToWorldCoordinates(e.screenPos);
        for (let i = 0; i < 5; i++) {
          engine.add(new SmallStar(world));
        }
      }

      this.activePointerId = null;
      this.holding = false;
      this.controller.moveDir = Vector.Zero;
    });
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    if (!this.enabled) return;

    if (this.starCooldown > 0) {
      this.starCooldown--;
    }

    // ⭐ 長押しで大きい星を生成
    if (this.holding && !this.moved) {
      this.holdTimer++;

      if (this.holdTimer === 30) {
        const world = engine.screenToWorldCoordinates(this.lastPos);
        engine.add(new BigStar(world));
      }
    }
  }

  private updateDirection(pos: Vector) {
    const delta = pos.sub(this.touchCenter);
    const len = delta.size;

    if (len < 5) {
      this.controller.moveDir = Vector.Zero;
      return;
    }

    this.controller.moveDir = delta.normalize();
  }
}

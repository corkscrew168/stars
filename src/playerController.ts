import { Actor, Vector, Keys, Engine } from "excalibur";
import { MobileController } from "./controller";

/* =========================
   プレイヤー挙動・設定まとめ
========================= */
export class PlayerController {
  // ここで全ての設定をまとめる
  private config = {
    speed: 160,
    jumpForce: 250,
    longJumpForce: 400,
    rotationSpeed: 0.1,
  };

  private canMove = false;

  constructor(
    private player: Actor,
    private controller: MobileController,
    private engine: Engine
  ) {
    this.setupKeyboard();
  }

  // ゲーム開始ボタンなどで移動を許可
  setCanMove(flag: boolean) {
    this.canMove = flag;
  }

  private setupKeyboard() {
    this.engine.on("preupdate", () => this.update());
  }

  private update() {
    if (!this.canMove) {
      this.player.vel.setTo(0, 0);
      return;
    }

    // コントローラーによる移動
    this.player.vel.setTo(
      this.controller.moveDir.x * this.config.speed,
      this.controller.moveDir.y * this.config.speed
    );

    // キーボード補助
    if (this.engine.input.keyboard.isHeld(Keys.Left)) this.player.vel.x = -this.config.speed;
    if (this.engine.input.keyboard.isHeld(Keys.Right)) this.player.vel.x = this.config.speed;
    if (this.engine.input.keyboard.isHeld(Keys.Up)) this.player.vel.y = -this.config.jumpForce;
    if (this.engine.input.keyboard.isHeld(Keys.Down)) this.player.vel.y = this.config.jumpForce;

    // ジャンプボタン判定
    if (this.controller.jumpPressed) {
      this.player.vel.y = -this.config.jumpForce;
    }

    // 回転などもここで設定可能
    // this.player.rotation += this.config.rotationSpeed;
  }
}

import { Actor, Engine, Vector, Color, Polygon } from "excalibur";

export class StartButton extends Actor {
  private star!: Polygon;
  private pulse = 0;
  private fading = false;
  private fadeAmount = 1;

  constructor(engine: Engine, onStart: () => void) {
    super({
      pos: new Vector(
        engine.drawWidth / 2,
        engine.drawHeight / 2 + 220
      ),
      z: 9999,
    });

    // ⭐ 星の頂点を作る
    const points: Vector[] = [];
    const outer = 80;
    const inner = 35;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const radius = i % 2 === 0 ? outer : inner;

      points.push(
        new Vector(
          Math.cos(angle - Math.PI / 2) * radius,
          Math.sin(angle - Math.PI / 2) * radius
        )
      );
    }

    // 🌫 グレー寄りのやさしい色
    this.star = new Polygon({
      points: points,
      color: Color.fromRGB(185, 185, 180),
    });

    this.graphics.use(this.star);

    // 少し小さく
    this.scale = new Vector(0.6, 0.6);

    // クリックでフェード開始
    this.on("pointerup", () => {
      this.fading = true;
      onStart();
    });
  }

  onPreUpdate() {
    // 🌟 やさしく点滅（グレー基準）
    if (!this.fading) {
      this.pulse += 0.06;

      const base = 180;
      const variation = 15;
      const brightness = base + Math.sin(this.pulse) * variation;

      this.star.color = Color.fromRGB(
        brightness,
        brightness,
        brightness - 5
      );
    }

    // 🌫 フェードアウト
    if (this.fading) {
      this.fadeAmount -= 0.02;

      if (this.fadeAmount <= 0) {
        this.kill();
        return;
      }

      const value = 180 * this.fadeAmount;

      this.star.color = Color.fromRGB(
       180,
    　　180,
    　　175,
    　　this.fadeAmount // ← アルファ値で透明にする
      );
    }
  }
}

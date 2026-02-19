import { Engine, Color, DisplayMode, Actor, Rectangle, vec } from "excalibur";
import { MobileController, ControlUI } from "./controller";
import { createPlayer } from "./player";
import { createWalls } from "./walls";
import { PlayerController } from "./playerController";
import { StartButton } from "./StartButton";
import { AllResources } from "./resources";
import { Label, Font, FontUnit } from "excalibur";



const WIDTH = 370;
const HEIGHT = 620;


// =========================
// ⭐ 星クラス（チカチカ）
// =========================
class Star extends Actor {
  constructor(x: number, y: number, size: number, color: Color) {
    super({
      pos: vec(x, y),
      width: size,
      height: size,
    });

    // 外側（金 or 青白）
    const outer = new Rectangle({
      width: size,
      height: size,
      color: color
    });

    this.graphics.use(outer);

    // 内側（白く光る中心）
    const innerActor = new Actor({
      pos: vec(0, 0), // 親基準
      width: size * 0.5,
      height: size * 0.5
    });

    const innerRect = new Rectangle({
      width: size * 0.5,
      height: size * 0.5,
      color: Color.White
    });

    innerActor.graphics.use(innerRect);

    // 中央に配置
    innerActor.pos = vec(size * 0.25, size * 0.25);

    this.addChild(innerActor);
  }
}


// =========================
// エンジン作成
// =========================
const game = new Engine({
  width: WIDTH,
  height: HEIGHT,
  pixelArt: true,
  backgroundColor: Color.fromRGB(10, 10, 30),

  displayMode: DisplayMode.Fixed,
  suppressPlayButton: true, // ← Playボタン非表示
});


// =========================
// ゲーム開始関数
// =========================
async function startGame() {


// =========================
// 🔥 画像を先にロード
// =========================
  await Promise.all(AllResources.map(r => r.load()));

// =========================
// Engine 起動
// =========================

  await game.start();


// =========================
// ⭐ 星を生成
// =========================
for (let i = 0; i < 30; i++) {
  const size = Math.random() * 2 + 2;

  // 半分ずつ色分け
  let color: Color;

if (Math.random() < 0.5) {
  color = new Color(255, 245, 160, 1); // 金
} else {
  color = new Color(220, 240, 255, 1); // 青白
}


  const star = new Star(
    Math.random() * game.drawWidth,
    Math.random() * game.drawHeight,
    size,
    color
  );

  star.z = -10;
  game.add(star);
}


// =========================
// 開発モード判定
// =========================
  if (import.meta.env.MODE === "development") {
    
    　// game.showDebug(true);

    const fpsLabel = new Label({
      text: "FPS: 0",
      pos: vec(10, 20),
      font: new Font({
        size: 16,
        unit: FontUnit.Px,
        color: Color.Yellow
      })
    });

    fpsLabel.z = 1000;
    game.add(fpsLabel);

    game.on("postupdate", (evt) => {
      const fps = Math.round(1000 / evt.delta);
      fpsLabel.text = `FPS: ${fps}`;
    });
  }



// =========================
// ゲーム状態管理
// =========================
let gameState: "ready" | "playing" | "gameover" = "ready";

// 外部から StartButton が参照できるように game に追加
(game as any).gameState = gameState;

  // =========================
  // プレイヤー生成
  // =========================
  const player = createPlayer(WIDTH / 2, HEIGHT - 100);
  game.add(player);
  player.graphics.visible = false;

  // =========================
  // 壁生成
  // =========================
  createWalls(game, game.drawWidth, game.drawHeight);

  // =========================
  // コントローラーとプレイヤーの挙動
  // =========================
  const controller = new MobileController();
  const controlUI = new ControlUI(controller, game);
  game.add(controlUI);

  const playerController = new PlayerController(player, controller, game);


  // =========================
  // スタートボタン（最前面に追加）
  // =========================
  const startButton = new StartButton(game, () => {
    gameState = "playing";
    controlUI.enabled = true;   // ← これを追加！
    console.log("ゲーム開始！");
  });
  game.add(startButton); // 最後に追加することで最前面に描画
}

// =========================
// ゲーム開始
// =========================
startGame();

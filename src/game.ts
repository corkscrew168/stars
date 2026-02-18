import { Engine, Color, DisplayMode } from "excalibur";
import { MobileController, ControlUI } from "./controller";
import { createPlayer } from "./player";
import { createWalls } from "./walls";
import { PlayerController } from "./playerController";
import { StartButton } from "./StartButton";
import { AllResources } from "./resources";


const WIDTH = 370;
const HEIGHT = 620;

// =========================
// エンジン作成
// =========================
const game = new Engine({
  width: WIDTH,
  height: HEIGHT,
  pixelArt: true,
  backgroundColor: Color.fromRGB(224, 224, 224),
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
  game.showDebug(true);
  await game.start();

// =========================
// 開発モード判定
// =========================
  if (import.meta.env.MODE === "development") {
    
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

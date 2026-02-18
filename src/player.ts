import * as ex from "excalibur";
import { playerSheet } from "./resources";

export function createPlayer(
  x: number,
  y: number,
  sheet: ex.SpriteSheet = playerSheet
) {

  // 1フレーム取得
  const sprite = sheet.getSprite(0, 0);

  const player = new ex.Actor({
    pos: new ex.Vector(x, y),

    width: sprite.width,
    height: sprite.height,

    collisionType: ex.CollisionType.Active,
  });

  // 画像表示
  player.graphics.use(sprite);

  // ★ ここが重要（画像サイズと完全一致）
  player.collider.set(
    ex.Shape.Box(sprite.width, sprite.height)
  );

  return player;
}

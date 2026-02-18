import { Actor, Vector, Color, CollisionType, Engine } from "excalibur";

const TOP_WALL = 20;      // ← 上壁を 20 に
const FLOOR = 160;
const SIDE_WALL = 20;

// 壁の色（#1a1a1a）
const WALL_COLOR = Color.Red;


export function createWalls(
  game: Engine,
  width: number,
  height: number
) {
  // =========================
  // 上壁
  // =========================
  game.add(
    new Actor({
      pos: new Vector(width / 2, TOP_WALL / 2),
      width,
      height: TOP_WALL,
      color: WALL_COLOR,
      collisionType: CollisionType.Fixed,
    })
  );

  // =========================
  // 下壁
  // =========================
  game.add(
    new Actor({
      pos: new Vector(width / 2, height - FLOOR / 2),
      width,
      height: FLOOR,
      color: WALL_COLOR,
      collisionType: CollisionType.Fixed,
    })
  );

  // =========================
  // 左壁
  // =========================
  game.add(
    new Actor({
      pos: new Vector(SIDE_WALL / 2, height / 2),
      width: SIDE_WALL,
      height,
      color: WALL_COLOR,
      collisionType: CollisionType.Fixed,
    })
  );

  // =========================
  // 右壁
  // =========================
  game.add(
    new Actor({
      pos: new Vector(width - SIDE_WALL / 2, height / 2),
      width: SIDE_WALL,
      height,
      color: WALL_COLOR,
      collisionType: CollisionType.Fixed,
    })
  );
}

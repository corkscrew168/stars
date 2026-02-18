import { ImageSource, SpriteSheet } from "excalibur";
import playerImg from "../assets/2025takuya.png";

// 画像
export const playerImage = new ImageSource(playerImg);

// 将来アニメ対応できるように SpriteSheet 化
export const playerSheet = SpriteSheet.fromImageSource({
  image: playerImage,
  grid: {
    rows: 1,
    columns: 1,
    spriteWidth: 65,
    spriteHeight: 78,
  },
});

// まとめてロードできるように配列化
export const AllResources = [playerImage];

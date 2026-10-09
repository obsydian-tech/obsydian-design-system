// The images the templates carry, drawn from the official shard and the real font:
//   logo-ink.png    the lockup for paper           logo-bone.png  the lockup for black
//   mark.png        the shard alone (email, tiles)  cover-a4.png   a dark A4 cover with the stone
//   deck-title.png  deck-plain.png  deck-close.png  16:9 grounds for the deck
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { png, lockup, shard, ground } from './render.mjs';

export async function renderAssets(dir) {
  mkdirSync(dir, { recursive: true });
  // The lockup: 22 units of mark to 17 of name, drawn at 120px tall for crisp print at 45mm.
  await png(`<div style="padding:8px">${lockup({ height: 120, on: 'light' })}</div>`, 1460, 136, join(dir, 'logo-ink.png'), { transparent: true });
  await png(`<div style="padding:8px">${lockup({ height: 120, on: 'dark' })}</div>`, 1460, 136, join(dir, 'logo-bone.png'), { transparent: true });
  await png(`<div style="padding:12px">${shard({ size: 232, glow: false, id: 'm' })}</div>`, 256, 274, join(dir, 'mark.png'), { transparent: true });
  // A4 at 300dpi (1240 by 1754 CSS pixels at 2x).
  await png(ground({ w: 1240, h: 1754, shardSize: 760, shardX: 430, shardY: 1120, haze: 0.2 }), 1240, 1754, join(dir, 'cover-a4.png'), { scale: 2 });
  // The eyebrow rule: 40 by 1 on the site; here 12mm of violet, centred in a box the height of a label's x-height band.
  await png('<div style="width:240px;height:56px;position:relative"><div style="position:absolute;left:0;right:0;top:24px;height:14px;background:#9318FF"></div></div>', 240, 56, join(dir, 'rule-violet.png'), { transparent: true });
  // 16:9 at 1920 by 1080.
  await png(ground({ w: 1920, h: 1080, shardSize: 760, shardX: 1020, shardY: 140, haze: 0.18 }), 1920, 1080, join(dir, 'deck-title.png'));
  await png(ground({ w: 1920, h: 1080, shardSize: 0, shardX: 1500, shardY: -300, haze: 0.07 }), 1920, 1080, join(dir, 'deck-plain.png'));
  await png(ground({ w: 1920, h: 1080, shardSize: 420, shardX: 1300, shardY: 520, haze: 0.16 }), 1920, 1080, join(dir, 'deck-close.png'));
}

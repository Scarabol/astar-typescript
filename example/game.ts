/**
 * @description Main Game Class
 * @author Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright 2019 - 2020 Digitsensitive
 * @license {@link https://opensource.org/licenses/MIT|MIT License}
 */

import 'phaser';
import { BootScene } from './scenes/boot-scene';
import { MainScene } from './scenes/main-scene';

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
  title: 'astar-typescript-example',
  version: '1.0.0',
  scale: {
    width: '100%',
    height: '100%',
    parent: 'game',
    mode: Phaser.Scale.ENVELOP
  },
  type: Phaser.AUTO,
  scene: [BootScene, MainScene]
};

// game class
export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener('load', () => {
  new Game(config);
});

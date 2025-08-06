// debug with extreme prejudice
"use strict"
import TinyTown from "./Scenes/TinyTownScene.js";

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 640,         // 10 tiles, each 16 pixels, scaled 4x
    height: 640,
    scene: [TinyTown]
}

const game = new Phaser.Game(config);
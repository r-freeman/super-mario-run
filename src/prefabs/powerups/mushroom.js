import config from "../../config";

class Mushroom extends Phaser.Sprite {
    /*
     * Mushroom power up allows mario to grow
     */
    constructor(game, x, y, key = 'mushroom') {
        super(game, x, y, key);

        // positioning
        this.x = game.width - 0.1;
        this.y = (game.height - 128) - game.cache.getImage(key).height;

        // give player this many points
        this.points = 1000;
        this.health = 50;

        // add physics
        game.physics.enable(this);
        this.body.allowGravity = true;
        this.body.immovable = false;
        this.body.collideWorldBounds = false;
        this.checkWorldBounds = true;

        // sounds
        this.game.add.audio('powerup_appears', config.VOLUME).play();

        game.add.existing(this);
    }
}

export default Mushroom
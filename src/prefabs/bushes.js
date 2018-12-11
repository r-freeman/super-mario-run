import config from '../config'

class Bushes extends Phaser.TileSprite {
    /*
     * this is one of the classes which makes up our scenery
     */
    constructor(game, x, y, width, height, key = 'bushes') {
        super(game, x, y, width, height, key);

        this.x = 0;
        this.y = game.height - 160;
        this.width = game.cache.getImage(key).width;
        this.height = game.cache.getImage(key).height;

        game.add.existing(this);
    }

    /*
     * creates the parallax effect
     */
    move() {
        this.tilePosition.x -= config.BUSHES_VELOCITY;
    }
}

export default Bushes
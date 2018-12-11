import config from '../config'

class Hills extends Phaser.TileSprite {
    /*
     * this is one of the classes which makes up our scenery
     */
    constructor(game, x, y, width, height, key = 'hills') {
        super(game, x, y, width, height, key);

        this.x = 0;
        this.y = game.height - 198;
        this.width = game.cache.getImage(key).width;
        this.height = game.cache.getImage(key).height;

        game.add.existing(this);
    }

    /*
     * creates the parallax effect
     */
    move() {
        this.tilePosition.x -= config.HILLS_VELOCITY;
    }
}

export default Hills
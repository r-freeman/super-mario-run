class Ground extends Phaser.TileSprite {
    /*
     * this is one of the classes which makes up our scenery
     * unlike other scenery elements this one has physics
     */
    constructor(game, x, y, width, height, key = 'ground') {
        super(game, x, y, width, height, key);

        this.x = 0;
        this.y = game.height - 128;
        this.width = game.width;
        this.height = game.cache.getImage(key).height * 2;

        game.physics.enable(this);
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;

        game.add.existing(this);
    }

    /*
     * creates the parallax effect
     */
    move(velocity) {
        this.tilePosition.x -= velocity;
    }
}

export default Ground
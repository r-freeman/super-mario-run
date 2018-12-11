class Pipe extends Phaser.Sprite {
    constructor(game, x, y, key = 'pipe') {
        super(game, x, y, key);

        this.x = game.width - 0.1;
        this.y = game.height - 128 - game.cache.getImage(key).height;

        this.points = 100;
        this.alive = true;
        this.damage = 50;

        game.physics.enable(this);
        this.body.allowGravity = true;
        this.body.immovable = false;
        this.body.collideWorldBounds = false;
        this.checkWorldBounds = true;

        game.add.existing(this);
    }

    kill() {
        this.alive = false;
    }
}

export default Pipe
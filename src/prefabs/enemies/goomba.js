class Goomba extends Phaser.Sprite {

    constructor(game, x, y, key = 'goomba') {
        super(game, x, y, key);

        // positioning
        this.x = game.width - 0.1;
        this.y = game.height - 128 - this.animations.currentFrame.height;

        this.points = 100;
        this.alive = true;
        this.damage = 50;
        this.speed = 2;

        // add animations
        this.animations.add('goomba_walk', Phaser.Animation.generateFrameNames('goomba_walk', 0, 1));
        this.animations.play('goomba_walk', 2, true);

        // add physics
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

export default Goomba
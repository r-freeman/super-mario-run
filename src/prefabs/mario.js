import config from '../config'

class Mario extends Phaser.Sprite {
    /*
     * this constructor allows us to define how big we want mario to be
     * in the case of the preloading animation mario is 2x his normal size
     */
    constructor(game, x, y, size = 'small', scale = 1, anchor = 0.5, key = 'mario') {
        super(game, x, y, key);

        // create array for audio
        this.audio = [];

        // positioning and scale
        this.x === 0 ? this.x = game.world.centerX : 0;
        this.y === 0 ? this.y = game.world.centerY : 0;
        this.scale.setTo(scale);
        this.anchor.setTo(anchor);

        // marios attributes
        this.size = size;
        this.alive = true;
        this.speed = 0;
        this.invulnerable = false;

        // set health according to marios size
        this.size === 'small' ? this.health = 50 : this.health = 100;

        // add animations
        this.animations.add('mario_super_run', Phaser.Animation.generateFrameNames('mario_super_run', 0, 2));
        this.animations.add('mario_super_idle', [2]);
        this.animations.add('mario_super_jump', [1]);
        this.animations.add('mario_small_run', Phaser.Animation.generateFrameNames('mario_small_run', 0, 2));
        this.animations.add('mario_small_idle', [8]);
        this.animations.add('mario_small_jump', [7]);
        this.animations.add('mario_small_die', [10]);

        // add audio with defined volume
        ['jump_super', 'jump_small', 'mariodie', 'powerup', 'powerdown'].forEach(el => this.audio[el] = game.add.audio(`${el}`, config.VOLUME));

        // give mario physics
        game.physics.enable(this);
        this.body.allowGravity = true;
        this.body.immovable = false;
        this.body.collideWorldBounds = true;

        // add to character to game
        game.add.existing(this);

        // set default animation to idle
        this.idle();
    }

    /*
     * handy function for changing animation takes the desired animation
     * fps and if we want it to loop
     */
    setAnimation(animation, fps, loop) {
        this.animations.play(`mario_${this.size}_${animation}`, fps, loop);

        // sets hit box surrounding mario to the width/height of current frame
        this.body.setSize(this.animations.currentFrame.width, this.animations.currentFrame.height);
    }

    idle() {
        this.setAnimation('idle', 1, false);
        this.speed = 0
    }

    run() {
        this.setAnimation('run', 10, true);

        // set run speed according to how big mario is
        this.size === 'small' ? this.speed = config.RUN_SPEED_SMALL : this.speed = config.RUN_SPEED_SUPER;
    }

    /*
     * method is called when mario collides with power up
     * offsets y so he doesn't clip through the ground and gives him health
     */
    grow(health) {
        this.size = 'super';
        this.y -= 30;
        this.health += health;
        this.audio['powerup'].play();
    }

    /*
     * method is called when mario has taken damage we make mario
     * temporarily invulnerable to give the player a chance to recover
     */
    shrink(damage) {
        this.size = 'small';
        this.y += 30;
        this.health -= damage;
        this.audio['powerdown'].play();

        // can't but damaged again while invulnerable is true
        this.invulnerable = true;
        // makes mario flicker for a few frames
        let tween = this.game.add.tween(this).to({alpha: -1}, 200, Phaser.Easing.Linear.None, true, 0, 5, true);
        // when flickering is done make him vulnerable again
        tween.onComplete.add(() => this.invulnerable = false);
    }

    /*
     * manages the jump animation and set velocity according
     * to how big mario is
     */
    jump() {
        this.setAnimation('jump', 1, false);

        if (this.size === 'small') {
            this.body.velocity.y = config.JUMP_VELOCITY_SMALL;
            this.audio['jump_small'].play();
        } else {
            this.body.velocity.y = config.JUMP_VELOCITY_SUPER;
            this.audio['jump_super'].play();
        }
    }

    /*
     * main death animation
     */
    kill() {
        this.bringToTop();
        this.size = 'small';
        this.setAnimation('die', 1, false);
        this.audio['mariodie'].play();
        this.speed = 0;
        this.alive = false;
        this.body.collideWorldBounds = false;
        this.body.velocity.y = config.JUMP_VELOCITY_SMALL;
    }
}

export default Mario
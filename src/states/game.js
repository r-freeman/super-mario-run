import Mario from '../prefabs/mario'
import Clouds from '../prefabs/clouds'
import Hills from '../prefabs/hills'
import Bushes from '../prefabs/bushes'
import Ground from '../prefabs/ground'
import Dialog from '../prefabs/dialog'
import Score from '../prefabs/score'

import PowerUpFactory from '../prefabs/powerups/powerupfactory'
import EnemyFactory from '../prefabs/enemies/enemyfactory'

import config from '../config'

class Game extends Phaser.State {

    /* set ready to false, since we don't want the game to start straight away.
     * tap count allows us to prevent mario from jumping on first tap.
     * create a sounds array, we use this in create to load various sounds.
     */
    constructor() {
        super();

        this.ready = false;
        this.tapCount = 0;
        this.sounds = [];
    }

    /*
     * here we set up physics, set the world bounds and create the scenery
     * we display a dialog to create a narrative, when the player taps on it the
     * game will begin.
     */
    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = config.GRAVITY;

        this.game.world.setBounds(0, 0, this.game.width, this.game.height);

        this.clouds = new Clouds(this.game);
        this.hills = new Hills(this.game);
        this.bushes = new Bushes(this.game);
        this.ground = new Ground(this.game);

        this.dialog = new Dialog(this.game);
        this.dialog.events.onInputDown.add(this.hideDialog, this);

        // music
        this.overworld = this.game.add.audio('overworld', config.VOLUME, true);

        // sounds
        ['pipe', 'coin'].forEach(el => this.sounds[el] = this.game.add.audio(`${el}`, config.VOLUME));

        // add score
        this.score = new Score(this.game);

        // drop mario into the game
        this.mario = new Mario(this.game, 128, -200);

        // play the pipe sound
        this.sounds['pipe'].play();

        // fade in dialog
        this.game.add.tween(this.dialog).to({alpha: 1}, 0, Phaser.Easing.Linear.None, true, 500);

        // tap listener
        this.game.input.onDown.add(this.onTap, this);

        // create a power ups group
        this.powerUps = this.game.add.group();

        // create an enemies group
        this.enemies = this.game.add.group();

        // set up the objects that collide with ground
        this.collisionGroup = [this.mario, this.powerUps, this.enemies];

        // variables to keep track of spawning power ups and enemies
        this.lastSpawnTime = 0;
        this.spawnInterval = Math.random() * config.SPAWNINTERVAL.MAX + config.SPAWNINTERVAL.MIN;
    }

    /*
     * this is the main game loop, it is responsible for keeping enemies, power ups and mario
     * on the ground. we create a collision handler so we can decide what happens when
     * mario collides with a power up or enemy
     */
    update() {
        if (!this.mario.alive) {
            // very important! keeps mario from getting stuck during death animation
            delete this.collisionGroup[0]
        }

        // keeps marios, enemies and power ups on ground
        this.game.physics.arcade.collide(this.collisionGroup, this.ground);
        // collision handler for mario, enemies and power ups
        this.game.physics.arcade.overlap(this.mario, [this.enemies, this.powerUps], this.onOverlap, null, this);

        // do this while game is ready and mario is alive
        if (this.ready && this.mario.alive) {
            this.ground.move(this.mario.speed); this.clouds.move(); this.hills.move(); this.bushes.move();

            // run as long as mario is touching the ground
            if (this.mario.body.touching.down) {
                this.mario.run();
            }

            // loop over each power up
            this.powerUps.forEach(powerUp => {
                // match marios speed
                powerUp.x -= this.mario.speed;
            });

            // loop over each enemy
            this.enemies.forEach(enemy => {
                // use enemies speed if defined or match marios speed
                typeof enemy.speed !== 'undefined' ? enemy.x -= this.mario.speed + enemy.speed : enemy.x -= this.mario.speed;

                // reward points if mario is has jumped over enemy and enemy is alive
                if (this.mario.x > (enemy.x + enemy.width) && this.mario.y < enemy.y && enemy.alive === true) {
                    this.rewardPoints(enemy);
                }
            });

            // call spawn timer function
            this.spawnTimer();
        }
    }

    /*
     * this function adds a floating score animation on mario it is called when he collides
     * with a power up or when he has successfully jumped over an enemy.
     * it takes an object as a parameter, which may be an enemy or power up from this we can determine
     * how many points to give the player
     */
    rewardPoints(object) {
        // creates a floating score animation on mario
        let reward = this.game.add.bitmapText(this.mario.x, this.mario.y, 'press_start_2p', `${object.points}`, 24);
        reward.anchor.setTo(0.5);
        this.game.add.tween(reward).to({
            y: this.mario.y - 50,
            alpha: 0
        }, 1000, Phaser.Easing.Linear.None, true);
        // increment score according to the objects points
        this.score.setScore(object.points);
        this.sounds['coin'].play();
        // kill the object so player can't be awarded any more points
        object.kill();
    }

    /*
     * make sure we dont consume too much resources by destroying
     * enemies and power ups which drift of the screen to the left
     */
    outOfBounds(object) {
        object.destroy();
    }

    /*
     * this timer is responsible for deciding when to spawn new enemies and power ups
     * SPAWNINTERVAL.MAX and SPAWNINTERVAL.MIN may be changed in the config file to make the
     * game easier or more challenging
     */
    spawnTimer() {
        let currentTime = this.game.time.time;

        // if current time - last spawn time is greater than spawn interval
        if (currentTime - this.lastSpawnTime > this.spawnInterval) {
            // set new random spawn interval between given range
            this.spawnInterval = Math.floor(Math.random() * config.SPAWNINTERVAL.MAX + config.SPAWNINTERVAL.MIN);
            // set last spawn time to now
            this.lastSpawnTime = currentTime;

            // call spawn random function
            this.spawnRandom();
        }
    }

    /*
     * spawns a power up if three conditions are true, 1. 50/50 chance Math.floor(Math.random() * 2) === 0
     * 2. mario must be small and 3. there must be no other power ups on the screen, else spawn an enemy.
     */
    spawnRandom() {
        if (Math.floor(Math.random() * 2) === 0 && this.mario.size === 'small' && this.powerUps.children.length === 0) {
            // uses PowerUpFactory to get a random instance of a power up
            let PowerUp = PowerUpFactory();
            this.powerUp = new PowerUp(this.game);
            // do this when power up goes off screen
            this.powerUp.events.onOutOfBounds.add(this.outOfBounds, this);
            // add to power up group so we can keep track of it
            this.powerUps.add(this.powerUp);
        } else {
            // uses EnemyFactory to get a random instance of an enemy
            let Enemy = EnemyFactory();
            this.enemy = new Enemy(this.game);
            // do this when enemy goes off screen
            this.enemy.events.onOutOfBounds.add(this.outOfBounds, this);
            // add to enemy group so we can keep track of it
            this.enemies.add(this.enemy);
        }
    }

    /*
     * main logic for checking collisions between mario and other objects.
     */
    onOverlap(mario, object) {
        // check if object belongs to power up group
        if (this.powerUps.children.indexOf(object) > -1) {
            // was mario small and on the ground ?
            if (this.mario.size === 'small' && this.mario.body.touching.down) {
                // triggers the reward points animation and increments score
                // and make mario grow
                this.rewardPoints(object);
                this.mario.grow(object.health);
                object.destroy();
            }
        // check if object belongs to enemy group, mario is alive and not invulnerable and object is alive
        } else if (this.enemies.children.indexOf(object) > -1 && this.mario.alive && !this.mario.invulnerable && object.alive) {
            // mario was hit!
            if (this.mario.health <= 50) {
                // trigger mario death sequence
                this.marioDeath();
            } else {
                // inflict damage on mario and shrink him
                this.mario.shrink(object.damage);
                // kill the object so it can't damage the player again
                object.kill();
            }
        }
    }

    /*
     * stops the update loop and triggers marios death sequence
     * loads the game over state in 3 seconds passing in the player's score
     */
    marioDeath() {
        this.ready = false;
        this.overworld.stop();
        this.mario.kill();
        this.game.time.events.add(3000, () => this.game.state.start('gameover', true, false, this.score.score), this);
    }

    /*
     * hides the opening dialog and kicks off the gameplay
     */
    hideDialog() {
        if (this.dialog.alpha === 1) {
            this.dialog.alpha = 0;
            this.overworld.play();
            this.ready = true;
        }

        this.tapCount++;
    }

    /*
     * function for making mario jump, game must be ready and mario must be touching down
     */
    onTap() {
        if (this.ready && this.mario.body.touching.down && this.tapCount >= 1) {
            this.mario.jump();
        }
    }
}

export default Game
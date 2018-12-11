import Mario from '../prefabs/mario'
import Clouds from '../prefabs/clouds'
import Hills from '../prefabs/hills'
import Bushes from '../prefabs/bushes'
import Ground from '../prefabs/ground'
import Score from '../prefabs/score'

import config from '../config'

class Highscore extends Phaser.State {
    /*
     * get the high score from local storage
     */
    constructor() {
        super();
        this.score = Score.getScoreLocalStore();
        this.audio = [];
    }

    /*
     * creates a scene similar to the main game instead we display
     * a trophy and the player's highscore
     */
    create() {
        // set up physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = config.GRAVITY;

        // create the scenery
        this.clouds = new Clouds(this.game);
        this.hills = new Hills(this.game);
        this.bushes = new Bushes(this.game);
        this.ground = new Ground(this.game);

        // create an instance of mario
        this.mario = new Mario(this.game, this.game.width * .5, this.game.height - 158, 'small', 1, 0.5);

        // create score text
        this.scoreText = this.game.add.bitmapText(this.game.width * .5, this.game.height * .5, 'press_start_2p', null, 36);
        this.scoreText.anchor.setTo(0.5);
        this.scoreText.align = 'center';

        // add music
        ['stageclear', 'gameover'].forEach(el => this.audio[el] = this.game.add.audio(el, config.VOLUME));

        // high score has never been set
        if (this.score === 0 || typeof this.score === 'undefined' || this.score === null) {
            // play gameover music
            this.audio['gameover'].play();

            // no highscore yet!
            this.scoreText.setText('NO HIGHSCORE!');

            // add tap handler to go back to intro when music has stopped
            this.audio['gameover'].onStop.add(() => this.game.input.onTap.add(() => this.game.state.start('intro'), this), this);
        } else {
            // play stage clear music
            this.audio['stageclear'].play();

            // display trophy image
            this.trophy = this.game.add.image(this.game.width * .5, this.game.height * .4, 'trophy');
            this.trophy.anchor.setTo(0.5);

            // set score text
            this.scoreText.setText(`HIGHSCORE\n${this.score}`);

            // add tap handler to go back to intro when music has stopped
            this.audio['stageclear'].onStop.add(() => this.game.input.onTap.add(() => this.game.state.start('intro'), this), this);
        }
    }

    /*
     * keep mario on the ground
     */
    update() {
        this.game.physics.arcade.collide(this.mario, this.ground);
    }
}

export default Highscore
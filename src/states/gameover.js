import Score from '../prefabs/score'
import config from '../config'

class GameOver extends Phaser.State {
    constructor() {
        super();
    }

    /*
     * only init method can take params from previous states
     * we initialise the score to make it available later
     */
    init(score) {
        this.score = score;
    }

    /*
     * fades in game over text and plays game over music
     * and then displays the player's final score
     */
    create() {
        // set background to black
        this.game.stage.backgroundColor = '#000000';

        // play gameover music
        this.gameover = this.game.add.audio('gameover', config.VOLUME);
        this.gameover.play();

        // set up game over text
        this.gameoverText = this.game.add.bitmapText(this.game.width * .5, this.game.height * .5, 'press_start_2p', 'GAME OVER', 36);
        this.gameoverText.anchor.setTo(0.5);
        this.gameoverText.alpha = 0;

        // fade in game over text
        let tween = this.game.add.tween(this.gameoverText).to({alpha: 1}, 0, Phaser.Easing.Linear.None, true);

        // run showScore function in 4 seconds
        this.game.time.events.add(4000, this.showScore, this);
    }

    /*
     * displays the score to the player and indicates if it is higher than the previous high score
     * if so we will store the new high score in local storage
     */
    showScore() {
        // create score text
        this.scoreText = this.game.add.bitmapText(this.game.width * .5, this.game.height * .5, 'press_start_2p', `SCORE\n${this.score}`, 36);
        this.scoreText.anchor.setTo(0.5);
        this.scoreText.align = 'center';
        this.scoreText.alpha = 0;

        // hide game over text
        this.gameoverText.alpha = 0;

        // check if current score is greater than old highscore
        if (this.score !== 0 && this.score > Score.getScoreLocalStore()) {
            // new high score, store it in local store
            this.scoreText.setText(`NEW HIGH SCORE!\n${this.score}`);
            Score.setScoreLocalStore(this.score);
        }

        // display score text
        this.scoreText.alpha = 1;

        // reload in 2000 seconds, refreshes local storage
        setInterval(() => {
            location.reload()
        }, 2500);
    }
}


export default GameOver
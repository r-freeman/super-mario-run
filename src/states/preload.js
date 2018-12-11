import Mario from '../prefabs/mario'

class Preload extends Phaser.State {
    constructor() {
        super()
    }

    /*
     * creates mario and progress text, kicks off
     * the preloading function by calling start
     */
    preload() {
        this.mario = new Mario(this.game, 0, 0, 'super', 2);

        this.progress = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 170, 'press_start_2p', '', 36);
        this.progress.anchor.setTo(0.5);

        this.start()
    }

    /*
     * adds custom event handlers whenever a file is downloaded
     * and start the intro state once preloading has completed
     */
    start() {
        // custom event handlers
        this.game.load.onFileComplete.add(this.fileComplete, this);
        this.game.load.onLoadComplete.add(() => this.game.state.start('intro'), this);

        // bind variables to load methods
        let audio = this.load.audio.bind(this.load);
        let image = this.load.image.bind(this.load);
        let atlas = this.load.atlas.bind(this.load);
        let sprite = this.load.image.bind(this.load);

        // load audio
        ['overworld', 'stageclear', 'gameover', 'mariodie', 'jump_small', 'jump_super', 'coin', 'pipe', 'powerup', 'powerdown', 'powerup_appears'].forEach(el => audio(el, `assets/audio/${el}.mp3`));

        // load images
        ['dialog', 'help', 'title', 'pointer'].forEach(el => image(el, `assets/images/${el}.png`));

        // load atlas
        ['buttons', 'goomba', 'koopa_green', 'koopa_red', 'spiny'].forEach(el => atlas(el, `assets/atlas/${el}.png`, `assets/atlas/${el}.json`));

        // load sprites
        ['ground', 'clouds', 'hills', 'bushes', 'mushroom', 'pipe', 'super_pipe', 'trophy'].forEach(el => sprite(el, `assets/sprites/${el}.png`));
    }

    /*
     * this is called everytime a file has downloaded
     * it updates the progress text on the screen
     * and makes mario run while preloading
     */
    fileComplete(progress) {
        this.progress.setText(`${progress}%`);
        this.mario.run();
    }
}

export default Preload
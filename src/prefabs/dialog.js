class Dialog extends Phaser.Image {
    /*
     * this is the opening dialog before the game starts
     */
    constructor(game, x, y, key = 'dialog') {
        super(game, x, y, key);

        this.x = game.width * .5;
        this.y = game.height * .5;

        this.anchor.setTo(0.5);
        this.alpha = 0;
        this.inputEnabled = true;

        game.add.existing(this);
    }
}

export default Dialog
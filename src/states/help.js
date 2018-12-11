class Help extends Phaser.State {
    constructor() {
        super();
    }

    /*
     * display help dialog on the screen explaining how to play
     * wait for player to tap the screen to return to main menu.
     */
    create() {
        this.help = this.game.add.image(this.game.width * .5, this.game.height * .5, 'help');
        this.help.anchor.setTo(0.5);
        this.help.inputEnabled = true;
        this.help.events.onInputDown.add(() => this.game.state.start('intro'), this);
    }
}

export default Help
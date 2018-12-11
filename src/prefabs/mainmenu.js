class MainMenu extends Phaser.Group {
    /*
     * this is the main menu
     */
    constructor(game, parent) {
        super(game, parent, 'main_menu', false, false);

        this.game = game;
        this.createButtons(['start', 'help', 'highscore', 'options']);
    }

    /*
     * this method creates the buttons in our menu
     * each button is given an event handler
     */
    createButtons(buttons) {
        this.removeAll();

        for (let index in buttons) {
            let button = this.game.make.button(0, 0, 'buttons', this.buttonOnClick, this, buttons[index], buttons[index], `${buttons[index]}_down`);
            button.name = buttons[index];
            this.add(button);
        }

        this.align(1, -1, 385, 95);

        this.x = this.game.world.centerX - this.width / 2;
        this.y = this.game.world.centerY - 20;
    }

    /*
     * this method checks which button was clicked
     * and decides what to do accordingly
     */
    buttonOnClick(button) {
        switch (button.name) {
            case 'start':
                this.game.state.start('game');
                break;
            case 'help':
                this.game.state.start('help');
                break;
            case 'highscore':
                this.game.state.start('highscore');
                break;
            case 'back':
                this.createButtons(['start', 'help', 'highscore', 'options']);
                break;
            case 'options':
                this.game.sound.mute ? this.createButtons(['back', 'sound_on']) : this.createButtons(['back', 'sound_off']);
                break;
            case 'sound_on':
                this.createButtons(['back', 'sound_off']);
                this.game.sound.mute = false;
                break;
            case 'sound_off':
                this.createButtons(['back', 'sound_on']);
                this.game.sound.mute = true;
                break;
        }
    }
}

export default MainMenu
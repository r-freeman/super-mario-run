import MainMenu from '../prefabs/mainmenu'

class Intro extends Phaser.State {
    constructor() {
        super()
    }

    /*
     * main intro sequence drops in the game logo
     * and displays the main menu
     */
    create() {
        this.game.stage.backgroundColor = '#a0acfc';

        let title = this.game.add.image(this.game.world.centerX, 200, 'title');
        title.anchor.setTo(0.5);

        let tween = this.game.add.tween(title).from({y: -200}, 2000, Phaser.Easing.Bounce.Out, true);
        tween.onComplete.add(() => new MainMenu(this.game, this.world), this);
    }
}

export default Intro
class Boot extends Phaser.State {
    constructor() {
        super()
    }

    /*
     * Use Phaser's scale manager to handle scaling
     */
    init() {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.forceOrientation(true);
    }

    /*
     * load the mario spritesheet and bitmap font, we want these to be available
     * for the preloader so we can show mario running while the game loads.
     */
    preload() {
        this.game.load.atlas('mario', 'assets/atlas/mario.png', 'assets/atlas/mario.json');
        this.game.load.bitmapFont('press_start_2p', 'assets/bitmap/press_start_2p.png', 'assets/bitmap/press_start_2p.xml');
    }

    /*
     * start the preload state
     */
    create() {
        this.game.state.start('preload')
    }
}

export default Boot
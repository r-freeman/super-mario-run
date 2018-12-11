import Boot from './states/boot'
import Preload from './states/preload'
import Intro from './states/intro'
import Game from './states/game'
import GameOver from './states/gameover'
import Help from './states/help'
import Highscore from './states/highscore'

const game = new Phaser.Game(600, 800, Phaser.AUTO, 'super-mario-run', null, false);

// add game states
game.state.add('boot', new Boot());
game.state.add('preload', new Preload());
game.state.add('intro', new Intro());
game.state.add('game', new Game());
game.state.add('gameover', new GameOver());
game.state.add('help', new Help());
game.state.add('highscore', new Highscore());

game.state.start('boot');
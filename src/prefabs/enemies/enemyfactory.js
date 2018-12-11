import Goomba from './goomba';
import Pipe from './pipe';
import SuperPipe from './superpipe'
import KoopaGreen from './koopa_green'
import KoopaRed from './koopa_red'
import Spiny from './spiny'

let enemies = [Goomba, Pipe, SuperPipe, KoopaGreen, KoopaRed, Spiny];

export default function EnemyFactory() {
    // returns a random enemy
    return enemies[Math.floor(Math.random() * enemies.length)];
}
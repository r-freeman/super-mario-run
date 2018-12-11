import Mushroom from './mushroom';

let powerUps = [Mushroom];

export default function PowerUpFactory() {
    // returns a random power up
    return powerUps[Math.floor(Math.random() * powerUps.length)];
}
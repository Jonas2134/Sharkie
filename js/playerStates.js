import { Bubble } from '../js/bubble.js'

const states = {
    IDLE: 0,
    SWIMMING: 1,
    ATTACK_BUBBLE: 2,
    ATTACK_FIN: 3,
    HURT: 4,
    DEAD: 5,
}

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

export class IDLE extends State {
    constructor(game) {
        super('IDLE', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 17;
        this.game.player.frameY = 0;
    }

    handleInput(input) {
        if (input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD")) this.game.player.setStates(states.SWIMMING, 1);
        else if (input.getKey("KeyE")) this.game.player.setStates(states.ATTACK_BUBBLE, 1);
        else if (input.getKey("Space")) this.game.player.setStates(states.ATTACK_FIN, 1);
    }
}

export class Swimming extends State {
    constructor(game) {
        super('SWIMMING', game);
        this.swimmingSound = new Audio('../audio/swimmingSound.mp3');
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 5;
        this.game.player.frameY = 1;
        if (this.game.soundOn) this.swimmingSound.play();
    }

    handleInput(input) {
        if (!(input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD"))) this.game.player.setStates(states.IDLE, 0);
        else if (input.getKey("KeyE")) this.game.player.setStates(states.ATTACK_BUBBLE, 1);
        else if (input.getKey("Space")) this.game.player.setStates(states.ATTACK_FIN, 1);
    }
}

export class BubbleAttack extends State {
    constructor(game) {
        super('ATTACK_BUBBLE', game);
        this.bubbleSound = new Audio('../audio/bubble.mp3');
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;

        const direction = !this.game.player.otherDirection;
        const bubble = new Bubble(this.game, this.game.player.x + (direction ? this.game.player.width : -20), this.game.player.y + this.game.player.height / 2, direction);
        this.game.bubbles.push(bubble);

        if (this.game.soundOn) this.bubbleSound.play();
    }

    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            if (!(input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD"))) this.game.player.setStates(states.IDLE, 0);
            else if (input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD")) this.game.player.setStates(states.SWIMMING, 1);
        }
    }
}

export class FinAttack extends State {
    constructor(game) {
        super('ATTACK_FIN', game);
        this.slapSound = new Audio('../audio/slap.mp3');
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 3;
        if (this.game.soundOn) this.slapSound.play();
    }

    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            if (!(input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD"))) this.game.player.setStates(states.IDLE, 0);
            else if (input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD")) this.game.player.setStates(states.SWIMMING, 1);
        }
    }
}

export class Hurt extends State {
    constructor(game) {
        super('HURT', game);
        this.hurtSound = new Audio('../audio/hurt.mp3');
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 4;
        if (this.game.soundOn) this.hurtSound.play();
    }

    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            if (this.game.player.health <= 0) this.game.player.setStates(states.DEAD, 0);
            else if (!(input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD"))) this.game.player.setStates(states.IDLE, 0);
            else if (input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD")) this.game.player.setStates(states.SWIMMING, 1);
        }
    }
}

export class Dead extends State {
    constructor(game) {
        super('DEAD', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 11;
        this.game.player.frameY = 5;
    }

    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            this.game.gameOver = true;
        }
    }
}
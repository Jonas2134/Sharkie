import { Bubble } from '../js/bubble.js'

/** 
 * Enumeration of player states
 */
const states = {
    IDLE: 0,
    SWIMMING: 1,
    ATTACK_BUBBLE: 2,
    ATTACK_FIN: 3,
    HURT: 4,
    DEAD: 5,
}

/** 
 * Base class representing a player state.
 */
class State {
    /**
     * @param {string} state - Name of the state.
     * @param {Object} game - Reference to the game object.
     */
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

/** 
 * Class representing the idle state of the player.
 */
export class IDLE extends State {
    /**
     * @param {Object} game - Reference to the game object.
     */
    constructor(game) {
        super('IDLE', game);
    }

    /** 
     * Enter idle state and set animation frames
     */
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 17;
        this.game.player.frameY = 0;
    }

    /**
     * Handle input in idle state.
     * @param {Object} input - Input handler object.
     */
    handleInput(input) {
        if (input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD")) this.game.player.setStates(states.SWIMMING, 1);
        else if (input.getKey("KeyE")) this.game.player.setStates(states.ATTACK_BUBBLE, 1);
        else if (input.getKey("Space")) this.game.player.setStates(states.ATTACK_FIN, 1);
    }
}

/** 
 * Class representing the swimming state of the player.
 */
export class Swimming extends State {
    /**
     * @param {Object} game - Reference to the game object.
     */
    constructor(game) {
        super('SWIMMING', game);
        this.swimmingSound = new Audio('../audio/swimmingSound.mp3');
        this.swimmingSound.volume = 0.5;
    }

    /** 
     * Enter swimming state and set animation frames
     */
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 5;
        this.game.player.frameY = 1;
        if (this.game.soundOn) this.swimmingSound.play();
    }

    /**
     * Handle input in swimming state.
     * @param {Object} input - Input handler object.
     */
    handleInput(input) {
        if (!(input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD"))) this.game.player.setStates(states.IDLE, 0);
        else if (input.getKey("KeyE")) this.game.player.setStates(states.ATTACK_BUBBLE, 1);
        else if (input.getKey("Space")) this.game.player.setStates(states.ATTACK_FIN, 1);
    }
}

/** 
 * Class representing the bubble attack state of the player.
 */
export class BubbleAttack extends State {
    /**
     * @param {Object} game - Reference to the game object.
     */
    constructor(game) {
        super('ATTACK_BUBBLE', game);
        this.bubbleSound = new Audio('../audio/bubble.mp3');
        this.bubbleSound.volume = 0.5;
    }

    /** 
     * Enter bubble attack state, create a bubble, and set animation frames
     */
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
        const direction = !this.game.player.otherDirection;
        const bubble = new Bubble(this.game, this.game.player.x + (direction ? this.game.player.width : -20), this.game.player.y + this.game.player.height / 2, direction);
        this.game.bubbles.push(bubble);
        if (this.game.soundOn) {
            this.bubbleSound.currentTime = 0;
            this.bubbleSound.play();
        }
    }

    /**
     * Handle input in bubble attack state.
     * @param {Object} input - Input handler object.
     */
    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            if (!(input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD"))) this.game.player.setStates(states.IDLE, 0);
            else if (input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD")) this.game.player.setStates(states.SWIMMING, 1);
        }
    }
}

/** 
 * Class representing the fin attack state of the player.
 */
export class FinAttack extends State {
    /**
     * @param {Object} game - Reference to the game object.
     */
    constructor(game) {
        super('ATTACK_FIN', game);
        this.slapSound = new Audio('../audio/slap.mp3');
        this.slapSound.volume = 0.5;
    }

    /** 
     * Enter fin attack state and set animation frames
     */
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 3;
        if (this.game.soundOn) {
            this.slapSound.currentTime = 0;
            this.slapSound.play();
        }
    }

    /**
     * Handle input in fin attack state.
     * @param {Object} input - Input handler object.
     */
    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            if (!(input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD"))) this.game.player.setStates(states.IDLE, 0);
            else if (input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD")) this.game.player.setStates(states.SWIMMING, 1);
        }
    }
}

/** 
 * Class representing the hurt state of the player.
 */
export class Hurt extends State {
    /**
     * @param {Object} game - Reference to the game object.
     */
    constructor(game) {
        super('HURT', game);
        this.hurtSound = new Audio('../audio/hurt.mp3');
        this.hurtSound.volume = 0.5;
    }

    /** 
     * Enter hurt state and set animation frames
     */
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 4;
        if (this.game.soundOn) {
            this.hurtSound.currentTime = 0;
            this.hurtSound.play();
        }
    }

    /**
     * Handle input in hurt state.
     * @param {Object} input - Input handler object.
     */
    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            if (this.game.player.health <= 0) this.game.player.setStates(states.DEAD, 0);
            else if (!(input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD"))) this.game.player.setStates(states.IDLE, 0);
            else if (input.getKey("KeyW") || input.getKey("KeyA") || input.getKey("KeyS") || input.getKey("KeyD")) this.game.player.setStates(states.SWIMMING, 1);
        }
    }
}

/** 
 * Class representing the dead state of the player.
 */
export class Dead extends State {
    /**
     * @param {Object} game - Reference to the game object.
     */
    constructor(game) {
        super('DEAD', game);
    }

    /** 
     * Enter dead state and set animation frames
     */
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 11;
        this.game.player.frameY = 5;
    }

    /**
     * Handle input in dead state.
     * @param {Object} input - Input handler object.
     */
    handleInput(input) {
        if (this.game.player.frameX >= this.game.player.maxFrame) {
            this.game.gameOver = true;
        }
    }
}
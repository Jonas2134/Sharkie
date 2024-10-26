const states = {
    SWIM: 0,
    SPAWN: 1,
    ATTACK: 2,
    DEAD: 3,
    HURT: 4,
}

/**
 * Base class representing a state of the end boss.
 */
class State {
    /**
     * Creates a state instance.
     * @param {string} state - The name of the state.
     * @param {Object} game - The game instance.
     */
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

/**
 * Swim state for the end boss.
 * End boss swims and may transition to attack state if close to the player.
 */
export class Swim extends State {
    /**
     * Creates a Swim state instance.
     * @param {Object} game - The game instance.
     */
    constructor(game) {
        super('SWIM', game);
    }

    /**
     * Sets up the swim animation frames for the end boss.
     */
    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 12;
        this.game.endboss.frameY = 0;
    }

    /**
     * Handles input to transition from swimming to attack if close to player.
     */
    handleInput() {
        const distanceToPlayer = Math.abs(this.game.endboss.x - this.game.player.x);
        const currentTime = Date.now();

        if (distanceToPlayer < 200) {
            if (currentTime - this.game.endboss.lastAttackTime >= this.game.endboss.attackCooldown) {
                this.game.endboss.setStates(states.ATTACK);
                this.game.endboss.lastAttackTime = currentTime;
            }
        }
    }
}

/**
 * Spawn state for the end boss.
 * Sets up the initial spawn animation and transitions to swimming.
 */
export class Spawn extends State {
    /**
     * Creates a Spawn state instance.
     * @param {Object} game - The game instance.
     */
    constructor(game) {
        super('SPAWN', game);
    }

    /**
     * Sets up the spawn animation frames for the end boss.
     */
    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 9;
        this.game.endboss.frameY = 1;
    }

    /**
     * Transitions from spawn to swim state once the spawn animation completes.
     */
    handleInput() {
        if (this.game.endboss.frameX >= this.game.endboss.maxFrame) this.game.endboss.setStates(states.SWIM);
    }
}

/**
 * Attack state for the end boss.
 * Sets up the attack animation and sound.
 */
export class Attack extends State {
    /**
     * Creates an Attack state instance.
     * @param {Object} game - The game instance.
     */
    constructor(game) {
        super('ATTACK', game);
        this.biteSound = new Audio('../audio/bite.mp3');
    }

    /**
     * Sets up the attack animation frames and plays the attack sound if sound is on.
     */
    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 5;
        this.game.endboss.frameY = 2;
        if (this.game.soundOn) this.biteSound.play();
    }

    /**
     * Transitions back to swim state once the attack animation completes.
     */
    handleInput() {
        if (this.game.endboss.frameX >= this.game.endboss.maxFrame) this.game.endboss.setStates(states.SWIM);
    }
}

/**
 * Dead state for the end boss.
 * Plays death sound and updates game state on end boss death.
 */
export class Dead extends State {
    /**
     * Creates a Dead state instance.
     * @param {Object} game - The game instance.
     */
    constructor(game) {
        super('DEAD', game);
        this.bossDeathSound = new Audio('../audio/bossDeathSound.mp3');
    }

    /**
     * Sets up the death animation frames and plays the death sound if sound is on.
     */
    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 5;
        this.game.endboss.frameY = 3;
        if (this.game.soundOn) this.bossDeathSound.play();
    }

    /**
     * Ends the game and increases score when the death animation completes.
     */
    handleInput() {
        if (this.game.endboss.frameX >= this.game.endboss.maxFrame) {
            this.game.score += 100;
            this.game.gameOver = true;
        }
    }
}

/**
 * Hurt state for the end boss.
 * Plays hurt sound and manages state transitions based on health.
 */
export class Hurt extends State {
    /**
     * Creates a Hurt state instance.
     * @param {Object} game - The game instance.
     */
    constructor(game) {
        super('HURT', game);
        this.bossHurtSound = new Audio('../audio/bossHurtSound.mp3');
    }

    /**
     * Sets up the hurt animation frames and plays the hurt sound if sound is on.
     */
    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 3;
        this.game.endboss.frameY = 4;
        if (this.game.soundOn) this.bossHurtSound.play();
    }

    /**
     * Transitions to dead or swim state based on the end boss's health.
     */
    handleInput() {
        if (this.game.endboss.health <= 0) {
            this.game.endboss.setStates(states.DEAD);
            return;
        } else if (this.game.endboss.frameX >= this.game.endboss.maxFrame) {
            this.game.endboss.setStates(states.SWIM);
        }
    }
}
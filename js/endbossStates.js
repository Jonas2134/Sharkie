const states = {
    SWIM: 0,
    SPAWN: 1,
    ATTACK: 2,
    DEAD: 3,
    HURT: 4,
}

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

export class Swim extends State {
    constructor(game) {
        super('SWIM', game);
    }

    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 12;
        this.game.endboss.frameY = 0;
    }

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

export class Spawn extends State {
    constructor(game) {
        super('SPAWN', game);
    }

    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 9;
        this.game.endboss.frameY = 1;
    }

    handleInput() {
        if (this.game.endboss.frameX >= this.game.endboss.maxFrame) this.game.endboss.setStates(states.SWIM);
    }
}

export class Attack extends State {
    constructor(game) {
        super('ATTACK', game);
        this.biteSound = new Audio('../audio/bite.mp3');
    }

    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 5;
        this.game.endboss.frameY = 2;
        if (this.game.soundOn) this.biteSound.play();
    }

    handleInput() {
        if (this.game.endboss.frameX >= this.game.endboss.maxFrame) this.game.endboss.setStates(states.SWIM);
    }
}

export class Dead extends State {
    constructor(game) {
        super('DEAD', game);
        this.bossDeathSound = new Audio('../audio/bossDeathSound.mp3');
    }

    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 5;
        this.game.endboss.frameY = 3;
        if (this.game.soundOn) this.bossDeathSound.play();
    }

    handleInput() {
        if (this.game.endboss.frameX >= this.game.endboss.maxFrame) {
            this.game.score += 100;
            this.game.gameOver = true;
        }
    }
}

export class Hurt extends State {
    constructor(game) {
        super('HURT', game);
        this.bossHurtSound = new Audio('../audio/bossHurtSound.mp3');
    }

    enter() {
        this.game.endboss.frameX = 0;
        this.game.endboss.maxFrame = 3;
        this.game.endboss.frameY = 4;
        if (this.game.soundOn) this.bossHurtSound.play();
    }

    handleInput() {
        if (this.game.endboss.health <= 0) {
            this.game.endboss.setStates(states.DEAD);
            return;
        } else if (this.game.endboss.frameX >= this.game.endboss.maxFrame) {
            this.game.endboss.setStates(states.SWIM);
        }
    }
}
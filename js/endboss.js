import { Swim, Spawn, Attack, Dead, Hurt } from '../js/endbossStates.js';

export class Endboss {
    constructor(game) {
        this.game = game;
        this.image = document.getElementById('endboss');
        this.width = 200;
        this.height = 234;
        this.frameWidth = 300;
        this.frameHeight = 350;
        this.x = this.game.width - this.width;
        this.y = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.speed = 2;
        this.health = 1000;
        this.maxHealth = 1000;
        this.fps = 15;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
        this.otherDirection = false;
        this.states = [new Swim(this.game), new Spawn(this.game), new Attack(this.game), new Dead(this.game), new Hurt(this.game)];
        this.lastAttackTime = 0;
        this.attackCooldown = 3000;
        this.hitboxOffsetX = 20;
        this.hitboxOffsetY = 110;
        this.hitboxWidth = this.width - 40;
        this.hitboxHeight = this.height - 150;
        this.invincible = false;
        this.invincibilityDuration = 1000;
        this.lastDamageTime = 0;
    }

    update(deltaTime) {
        this.updateHitbox();
        this.currentState.handleInput();

        if (this.currentState !== this.states[3] && this.currentState !== this.states[4] && this.currentState !== this.states[1]) {
            if (this.game.player.x < this.x && this.otherDirection) this.otherDirection = false;
            else if (this.game.player.x > this.x && !this.otherDirection) this.otherDirection = true;

            if (!this.otherDirection) this.x -= this.speed;
            else this.x += this.speed;

            if (this.game.player.y < this.y) this.y -= this.speed;
            else if (this.game.player.y > this.y) this.y += this.speed;
        }

        if (this.invincible && Date.now() - this.lastDamageTime > this.invincibilityDuration) {
            this.invincible = false;
        }

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else this.frameTimer += deltaTime;
    }

    takeDamage() {
        if (!this.invincible) {
            this.setStates(4);
            this.health -= 50;
            this.invincible = true;
            this.lastDamageTime = Date.now();
        }
    }

    updateHitbox() {
        switch (this.currentState) {
            case this.states[3]:
                this.hitboxOffsetX = 20;
                this.hitboxOffsetY = 50;
                this.hitboxWidth = this.width - 40;
                this.hitboxHeight = this.height - 100;
                break;
            default:
                this.hitboxOffsetX = 20;
                this.hitboxOffsetY = 110;
                this.hitboxWidth = this.width - 40;
                this.hitboxHeight = this.height - 150;
        }
    }

    draw(ctx) {
        if (this.otherDirection) this.game.flipImage(ctx, this);
        if (this.game.debug) {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x + this.hitboxOffsetX, this.y + this.hitboxOffsetY, this.hitboxWidth, this.hitboxHeight);
        }
        ctx.drawImage(this.image, this.frameX * this.frameWidth, this.frameY * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
        if (this.otherDirection) this.game.flipImageBack(ctx, this);
    }

    setStates(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }
}
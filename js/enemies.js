import { Smoke } from "../js/smoke.js";

class Enemy {
    constructor(game) {
        this.game = game;        
        this.fps = 15;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.x -= this.speedX;
        this.y += this.speedY;
        if (this.game.player.x + this.game.player.hitboxOffsetX + this.game.player.hitboxWidth === this.game.width - 200) this.x -= this.speedX + this.game.speed;

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else this.frameTimer += deltaTime;

        if (this.markedForDeletion) {
            this.game.enemies.splice(this.game.enemies.indexOf(this), 1);
            this.game.smokes.push(new Smoke(this.game, this.x, this.y));
        }

        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(ctx) {
        if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frameX * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
    }

    setState(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }
}

class HorizontalSwimmingEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.frameWidth = 50;
        this.frameHeight = 41;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game. height * 0.5;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 4;
    }

    update(deltaTime) {
        super.update(deltaTime);
    }
}

export class PufferfishGreen extends HorizontalSwimmingEnemy {
    constructor(game) {
        super(game);
        this.image = document.getElementById('pufferfish_green');
        this.width = 50;
        this.height = 41;
    }
}

export class PufferfishOrange extends HorizontalSwimmingEnemy {
    constructor(game) {
        super(game);
        this.image = document.getElementById('pufferfish_orange');
        this.width = 50;
        this.height = 41;
    }
}

export class PufferfishRose extends HorizontalSwimmingEnemy {
    constructor(game) {
        super(game);
        this.image = document.getElementById('pufferfish_rose');
        this.width = 50;
        this.height = 41;
    }
}

class VerticalSwimmingEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.frameWidth = 100;
        this.frameHeight = 142;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 3;
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.y > this.game.height - this.height) this.speedY *= -1;
        if (this.y < -this.height) this.markedForDeletion = true;        
    }

    draw(ctx) {
        super.draw(ctx);
    }
}

export class JellyfishLila extends VerticalSwimmingEnemy {
    constructor(game) {
        super(game);
        this.image = document.getElementById('jellyfish_lila');
        this.width = 100;
        this.height = 142;
    }
}
export class JellyfishYellow extends VerticalSwimmingEnemy {
    constructor(game) {
        super(game);
        this.image = document.getElementById('jellyfish_yellow');
        this.width = 100;
        this.height = 142;
    }
}
export class JellyfishPink extends VerticalSwimmingEnemy {
    constructor(game) {
        super(game);
        this.image = document.getElementById('jellyfish_pink');
        this.width = 100;
        this.height = 142;
    }
}
export class JellyfishGreen extends VerticalSwimmingEnemy {
    constructor(game) {
        super(game);
        this.image = document.getElementById('jellyfish_green');
        this.width = 100;
        this.height = 142;
    }
}
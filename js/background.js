class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }

    update() {
        if (this.x < -this.width) this.x = 0;
        if (this.game.player.x + this.game.player.hitboxOffsetX + this.game.player.hitboxWidth === this.game.width - 200) this.x -= this.game.speed * this.speedModifier;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width - 1, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game) {
        this.game = game;
        this.width = 1440;
        this.height = 480;
        this.layer4image = document.getElementById('layer4');
        this.layer3image = document.getElementById('layer3');
        this.layer2image = document.getElementById('layer2');
        this.layer1image = document.getElementById('layer1');
        this.layerLightimage = document.getElementById('light');
        this.layer1 = new Layer(this.game, this.width, this.height, 0.2, this.layer4image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.4, this.layer3image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.6, this.layer2image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer1image);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layerLightimage);
        this.backgroundLayer = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
    }

    update() {
        this.backgroundLayer.forEach(layer => {
            layer.update();
        })
    }

    draw(ctx) {
        this.backgroundLayer.forEach(layer => {
            layer.draw(ctx);
        })
    }
}
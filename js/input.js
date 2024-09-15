export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        window.addEventListener('keydown', async e => {
            e.preventDefault();
            if (e.repeat) return;
            this.keys [e.code] = true;

            if (e.code === "KeyT") this.game.debug = !this.game.debug;
        });

        window.addEventListener('keyup', async e => {
            e.preventDefault();
            if (e.repeat) return;
            this.keys [e.code] = false;
        });
    }

    getKey(key) {
        return this.keys[key];
    }
}
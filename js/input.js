import { Joystick } from "../js/joystick.js";
import { Button } from "../js/buttons.js";

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.mobile = false;
        this.joystick = new Joystick(game.width * 0.12, game.height * 0.82, game.width * 0.06, game.width * 0.035);
        this.attackButton1 = new Button(game.width * 0.9, game.height * 0.75, 30, 'rgba(255, 0, 0, 0.9)', 'BA');
        this.attackButton2 = new Button(game.width * 0.8, game.height * 0.85, 30, 'rgba(0, 255, 0, 0.9)', 'FA');
        this.deadZone = 0.15;

        window.addEventListener('keydown', async e => {
            e.preventDefault();
            if (e.repeat) return;
            this.keys[e.code] = true;

            if (e.code === "KeyT") this.game.debug = !this.game.debug;
        });

        window.addEventListener('keyup', async e => {
            e.preventDefault();
            if (e.repeat) return;
            this.keys[e.code] = false;
        });
    }

    //TODO: Add E Key and Space for touch

    getKey(key) {
        if (this.mobile) {
            this.keys["KeyD"] = false;
            this.keys["KeyA"] = false;
            this.keys["KeyS"] = false;
            this.keys["KeyW"] = false;
            this.keys["KeyE"] = false;
            this.keys["Space"] = false;

            if (this.joystick.inputPos.x >= this.deadZone) {
                this.keys["KeyD"] = this.joystick.inputPos.x;
            } else if (this.joystick.inputPos.x <= -this.deadZone) {
                this.keys["KeyA"] = this.joystick.inputPos.x;
            }

            if (this.joystick.inputPos.y >= this.deadZone) {
                this.keys["KeyW"] = this.joystick.inputPos.y;
            } else if (this.joystick.inputPos.y <= -this.deadZone) {
                this.keys["KeyS"] = this.joystick.inputPos.y;
            }

            if (this.attackButton1.isPressed) {
                this.keys["KeyE"] = true;
            }
            if (this.attackButton2.isPressed) {
                this.keys["Space"] = true;
            }
        }

        return this.keys[key];
    }

    draw(ctx) {
        if (this.mobile) {
            this.joystick.update(ctx);
            this.attackButton1.update(ctx);
            this.attackButton2.update(ctx);
        }
    }
}
import { Joystick } from "../js/joystick.js";
import { Button } from "../js/buttons.js";

/**
 * Class responsible for handling user input for the game.
 */
export class InputHandler {
    /**
     * Creates an InputHandler instance.
     * @param {Object} game - The game instance.
     */
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.mobile = false;
        this.joystick = new Joystick(game, game.width * 0.12, game.height * 0.82, game.width * 0.06, game.width * 0.035);
        this.attackButton1 = new Button(game.width * 0.9, game.height * 0.75, 30, 'rgba(255, 0, 0, 0.9)', 'BA');
        this.attackButton2 = new Button(game.width * 0.8, game.height * 0.85, 30, 'rgba(0, 255, 0, 0.9)', 'FA');
        this.deadZone = 0.15;

        window.addEventListener('keydown', async e => {
            e.preventDefault();
            if (e.repeat) return;
            this.keys[e.code] = true;
            if (e.code === "KeyE" || e.code === "Space") setTimeout(() => this.keys[e.code] = false, 200);
            if (e.code === "KeyT") this.game.debug = !this.game.debug;
        });

        window.addEventListener('keyup', async e => {
            e.preventDefault();
            if (e.repeat) return;
            this.keys[e.code] = false;
        });
    }

    /**
     * Retrieves the state of a specified key.
     * On mobile, this method uses joystick and button inputs to simulate key states.
     * @param {string} key - The key code to check, e.g., "KeyW" or "Space".
     * @returns {boolean} - The state of the specified key.
     */
    getKey(key) {
        if (this.mobile) {
            const keysToReset = ["KeyD", "KeyA", "KeyS", "KeyW", "KeyE", "Space"];
            keysToReset.forEach(k => this.keys[k] = false);
            const joystickX = this.joystick.inputPos.x;
            const joystickY = this.joystick.inputPos.y;
            this.keys["KeyD"] = joystickX >= this.deadZone ? joystickX : false;
            this.keys["KeyA"] = joystickX <= -this.deadZone ? joystickX : false;
            this.keys["KeyW"] = joystickY >= this.deadZone ? joystickY : false;
            this.keys["KeyS"] = joystickY <= -this.deadZone ? joystickY : false;
            this.keys["KeyE"] = this.attackButton1.isPressed;
            this.keys["Space"] = this.attackButton2.isPressed;
        }
        return this.keys[key];
    }

    /**
     * Draws the joystick and buttons on the canvas when in mobile mode.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.mobile) {
            this.joystick.update(ctx);
            this.attackButton1.update(ctx);
            this.attackButton2.update(ctx);
        }
    }
}
/**
 * Class representing a 2D vector with basic vector operations.
 */
export class Vector2 {
    /**
     * Creates a vector with x and y coordinates.
     * @param {number} x - The x-coordinate of the vector.
     * @param {number} y - The y-coordinate of the vector.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds another vector to this vector.
     * @param {Vector2} vector - The vector to add.
     * @returns {Vector2} A new vector that is the sum of this vector and the input vector.
     */
    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    /**
     * Subtracts another vector from this vector.
     * @param {Vector2} vector - The vector to subtract.
     * @returns {Vector2} A new vector that is the difference of this vector and the input vector.
     */
    sub(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    /**
     * Multiplies this vector by a scalar.
     * @param {number} n - The scalar to multiply by.
     * @returns {Vector2} A new vector that is the result of the multiplication.
     */
    mul(n) {
        return new Vector2(this.x * n, this.y * n);
    }

    /**
     * Divides this vector by a scalar.
     * @param {number} n - The scalar to divide by.
     * @returns {Vector2} A new vector that is the result of the division.
     */
    div(n) {
        return new Vector2(this.x / n, this.y / n);
    }

    /**
     * Calculates the magnitude (length) of this vector.
     * @returns {number} The magnitude of the vector.
     */
    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * Normalizes the vector to a unit vector (magnitude of 1).
     * @returns {Vector2} A new unit vector pointing in the same direction.
     */
    normalize() {
        return this.mag() === 0 ? new Vector2(0, 0) : this.div(this.mag());
    }
    
    /**
     * Clamps each component of this vector within the specified minimum and maximum range.
     * @param {number} min - The minimum value for each component.
     * @param {number} max - The maximum value for each component.
     * @returns {Vector2} A new vector with clamped components.
     */
    clamp(min, max) {
        return new Vector2(
            Math.min(Math.max(this.x, min), max),
            Math.min(Math.max(this.y, min), max)
        );
    }
}
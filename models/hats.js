const Joi = require("joi");

class Hat {

    constructor(existingHat) {
        this.hatId = existingHat.hatId;
        this.colors = existingHat.colors;
        this.price = existingHat.price;
        this.imageName = existingHat.imageName;
    };

    // First - define rules regarding product properties - validation schema:
    static #postValidationSchema = Joi.object({
        hatId: Joi.number().optional(),
        colors: Joi.string().required().min(2).max(100),
        price: Joi.number().required().min(0).max(10000),
        imageName: Joi.string().optional().min(0).max(10000)
    });

    static #putValidationSchema = Joi.object({
        hatId: Joi.number().optional().positive().integer(),
        colors: Joi.string().required().min(2).max(100),
        price: Joi.number().required().min(0).max(10000),
        imageName: Joi.string().optional().min(0).max(10000)
    });

    // Second - perform the validation on our product:
    validatePost() {
        const result = Hat.#postValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null;
    }

    validatePut() {
        const result = Hat.#putValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null;
    }

}

module.exports = Hat;
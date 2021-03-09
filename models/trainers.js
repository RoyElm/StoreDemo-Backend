const Joi = require("joi"); // npm i joi

class Trainer {

    constructor(existingMethod) {
        this.review = existingMethod.review;
    }

    // First - define rules regarding product properties - validation schema:
    static #postValidationSchema = Joi.object({
        reviews: Joi.string().required().min(5).max(10000)
    });

    static #putValidationSchema = Joi.object({
        reviews: Joi.string().required().min(5).max(10000)
    });


    // Second - perform the validation on our product:
    validatePost() {
        const result = Product.#postValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null; // Return one string of the errors. for returning array of string errors: return result.error ? result.error.message.split(". ") : null;
    }

    validatePut() {
        const result = Product.#putValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null; // Return one string of the errors.
    }

}

module.exports = Trainer;
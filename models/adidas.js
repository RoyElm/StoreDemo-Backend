const Joi = require("joi"); // npm i joi

class Adidas {

    constructor(existingProduct) {
        this.id = existingProduct.id;
        this.name = existingProduct.name;
        this.price = existingProduct.price;
        this.stock = existingProduct.stock;
    }

    // First - define rules regarding product properties - validation schema:
    static #postValidationSchema = Joi.object({
        id: Joi.number().optional(),
        name: Joi.string().required().min(2).max(100),
        price: Joi.number().required().min(0).max(10000),
        stock: Joi.number().required().min(0).max(10000).integer()
    });
    static #putValidationSchema = Joi.object({
        id: Joi.number().required().positive().integer(),
        name: Joi.string().required().min(2).max(100),
        price: Joi.number().required().min(0).max(10000),
        stock: Joi.number().required().min(0).max(10000).integer()
    });
    static #patchValidationSchema = Joi.object({
        id: Joi.number().required().positive().integer(),
        name: Joi.string().min(2).max(100),
        price: Joi.number().min(0).max(10000),
        stock: Joi.number().min(0).max(10000).integer()
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
    validatePatch() {
        const result = Product.#patchValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null; // Return one string of the errors.
    }

}

module.exports = Adidas;
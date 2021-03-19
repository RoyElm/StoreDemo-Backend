const Joi = require("joi");

class Item {

    constructor(existingItem) {
        this.itemId = existingItem.itemId;
        this.itemName = existingItem.itemName;
        this.description = existingItem.description;
        this.colors = existingItem.colors;
        this.itemPrice = existingItem.itemPrice;
        this.imageName = existingItem.imageName;
    };

    // First - define rules regarding product properties - validation schema:
    static #postValidationSchema = Joi.object({
        itemId: Joi.number().optional(),
        itemName: Joi.string().required().min(2).max(100),
        description: Joi.string().optional().min(0).max(10000),
        colors: Joi.string().optional().min(0).max(10000),
        itemPrice: Joi.number().required().min(0).max(10000),
        imageName: Joi.string().optional().min(0).max(10000),
    });

    static #putValidationSchema = Joi.object({
        itemId: Joi.number().optional(),
        itemName: Joi.string().required().min(2).max(100),
        description: Joi.string().optional().min(0).max(10000),
        colors: Joi.string().optional().min(0).max(10000),
        itemPrice: Joi.number().required().min(0).max(10000),
        imageName: Joi.string().optional().min(0).max(10000),
    });

    // Second - perform the validation on our product:
    validatePost() {
        const result = Item.#postValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null; // Return one string of the errors. for returning array of string errors: return result.error ? result.error.message.split(". ") : null;
    }

    validatePut() {
        const result = Item.#putValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null; // Return one string of the errors.
    }

}

module.exports = Item;
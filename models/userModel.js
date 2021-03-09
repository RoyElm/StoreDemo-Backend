const Joi = require("joi");
//Validate data of user
class UserModel {

    constructor(existingUsers) {
        this.firstName = existingUsers.firstName;
        this.lastName = existingUsers.lastName;
        this.email = existingUsers.email;
        this.password = existingUsers.password;
    };

    // static #registerValidateSchema = Joi.object({
    //     firstName: Joi.string().required().min(2).max(30),
    //     lastName: Joi.string().required().min(2).max(30),
    //     email: Joi.string().required().min(10).max(30),
    //     password: Joi.string().required().min(6).max(5000),
    // });

    static #loginValidateSchema = Joi.object({
        firstName: Joi.optional(),
        lastName: Joi.optional(),
        email: Joi.string().required().min(2).max(30),
        password: Joi.string().required().min(2).max(5000),
    });

    validateLogin() {
        const result = UserModel.#loginValidateSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null;
    }

    // validatePost() {
    //     const result = UserModel.#registerValidateSchema.validate(this, { abortEarly: false });
    //     return result.error ? result.error.message : null;
    // }

}
module.exports = UserModel;
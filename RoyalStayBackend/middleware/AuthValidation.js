import Joi from 'joi';

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        phone: Joi.string()
            .pattern(/^\d{10}$/)
            .message('Phone number must be a valid 10-digit number')
            .required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        termsAccepted: Joi.boolean().valid(true).required().messages({ 'any.only': 'You must accept Terms and Conditions and Privacy Policy' }),
        subscribeNewsletter: Joi.boolean().default(false)
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "signup validation failed", error:error.details[0].message });
    }
    next();
}


const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
        rememberMe: Joi.boolean().truthy('true').falsy('false').default(false)
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: " login validation failed", error: error.details[0].message });
    }
    next();
}

export { signupValidation, loginValidation };
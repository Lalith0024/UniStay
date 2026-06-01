const joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(3).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(100).required(),
    role: joi.string().valid('student', 'warden', 'admin').optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      error: error.details,
      success: false
    });
  }
  next();
}

const loginvalidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).max(100).required(),
    role: joi.string().valid('student', 'warden', 'admin').optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      error: error.details,
      success: false
    });
  }
  next();
}

module.exports = { signupValidation, loginvalidation };

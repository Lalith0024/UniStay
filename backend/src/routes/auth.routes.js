const {signup, login} = require('../controllers/auth.controller');
const {signupValidation,loginvalidation} = require('../middlewares/auth-validation.middleware');

const router = require('express').Router();

router.post('/signup',signupValidation,signup);
router.post('/login',loginvalidation,login);

module.exports = router;

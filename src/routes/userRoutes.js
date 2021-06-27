const router = require('express').Router();
const schemas = require('../middlewares/joiScheemas');
const joiMiddleware = require('../middlewares/joiMiddleware');
const userControler = require('../controller/userController')

router.post('/', joiMiddleware(schemas.userPOST, 'body'), userControler.createUser);
router.post('/login', joiMiddleware(schemas.userLoginPOST, 'body'), userControler.login);


module.exports = router;

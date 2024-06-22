import * as user from '../controllers/user.controller'

const { check } = require('express-validator');
import express = require('express');
import{upload} from '../multer'


const userRouter: express.Router = express.Router();

userRouter.post('/createUser', upload.single('img'), [
    check('name', 'the name is required').not().isEmpty(),
    check('code', 'the code is required').not().isEmpty(),
], user.createUser
)

userRouter.get('/getUserByRol/:code', user.getUserByRol)
userRouter.put("/updateUser/:id", upload.single('img'), user.updateUser);
userRouter.delete("/deleteUser/:id", user.deleteUser);


export default userRouter;
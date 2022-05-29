import {Router} from 'express'
const router = Router();

import {tokenValidation} from '../libs/validateToken'

import {signup, signin, profile} from '../controllers/auth.controller'

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/profile').get(tokenValidation, profile);

export default router;
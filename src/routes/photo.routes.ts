import {Router} from 'express';

const router = Router();

import {createPhoto, getPhotos, getPhoto, deletePhoto, updatePhoto} from '../controllers/photo.controller'
import {tokenValidation} from '../libs/validateToken'

import multer from '../libs/multer'

router.route('/photos')
    .get(tokenValidation, getPhotos)
    .post(tokenValidation, multer.single('image'), createPhoto)
    
router.route('/photos/:id')
    .get(tokenValidation, getPhoto)
    .delete(tokenValidation, deletePhoto)
    .put(tokenValidation, updatePhoto)


//router.route('/').get(HelloWorld);

export default router;
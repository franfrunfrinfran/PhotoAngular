import {Request, Response} from 'express'
import path from 'path'
import fs from 'fs-extra'


import Photo from '../models/Photo'


//Varias fotos
export async function getPhotos (req : Request, res : Response): Promise<Response> {
    const photos = await Photo.find({_idUser: req.userId})
    
    return res.json(photos);
}
//Una foto
export async function getPhoto (req : Request, res : Response): Promise<Response> {
    const {id} = req.params;
    const photo = await Photo.findById(id);
    return res.json(photo);
}



export async function createPhoto(req : Request, res : Response): Promise<Response> {
    
    console.log('Saving photo...');
       
    const {title, description} = req.body;
    const newPhoto = {
        title: title,
        description: description,
        imagePath: req.file?.path,
        _idUser: req.userId
    };

    const photo = new Photo(newPhoto);
    await photo.save();
    
    return res.json({
        message:'Photo create',
        photo
    });
};

export async function deletePhoto(req: Request, res : Response): Promise<Response>{

    const {id} = req.params;

    let photo = null;
    try {
        photo = await Photo.findById(id)
    
        if(photo) {
            if(photo?._idUser == req.userId){
                
                await Photo.findByIdAndRemove(id)
                
                await fs.unlink(path.resolve(photo!.imagePath))
                return res.json({
                    message:'Photo Delete',
                    photo
                });
            }
        }

        return res.status(404).json({
            error: 404,
            message: "Photo not found"
        })
    } catch (err) {
        console.error('ERROR: ', err)
        return res.status(400).json({
            error: 400,
            message: "Bad request"
        })
    }
}


export async function updatePhoto(req: Request, res : Response): Promise<Response>{
    const {id} = req.params;
    const {title, description} = req.body

    const updatedPhoto = await Photo.findByIdAndUpdate(id, {
        title,
        description
    },  {new : true});
    
    return res.json({
        message:'Successful Update',
        updatedPhoto
   });
}
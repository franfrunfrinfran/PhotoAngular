import {Request, Response} from 'express'
import path from 'path'
import fs from 'fs-extra'


import Photo from '../models/Photo'


//Varias fotos
export async function getPhotos (req : Request, res : Response): Promise<Response> {
    const photos = await Photo.find();
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
        imagePath: req.file?.path
    };

    const photo = new Photo(newPhoto);
    await photo.save();
    //console.log(photo);
    
    return res.json({
        message:'Photo create',
        photo
    });
};

export async function deletePhoto(req: Request, res : Response): Promise<Response>{

    const {id} = req.params;
    //console.log(id);
    const photo = await Photo.findByIdAndRemove(id);
    console.log(photo);
        
    try {
        if (photo){
            console.log(path)
            await fs.unlink(path.resolve(photo.imagePath))
        }
    } catch (err) {
        console.error('There was an error', err)
    }
        
    return res.json({
        message:'Photo Delete',
        photo
    });
}


export async function updatePhoto(req: Request, res : Response): Promise<Response>{
    const {id} = req.params;
    const {title, description} = req.body
    console.log(req.body)
    const updatedPhoto = await Photo.findByIdAndUpdate(id, {
        title,
        description
    },  {new : true});
    
    return res.json({
        message:'Successful Update',
        updatedPhoto
   });
}

    /*     var bodyParser = require('body-parser')
    
    bodyParser.urlencoded({
        extended: true
    });
    */

/* export function HelloWorld(req : Request, res : Response):Response {
   
    return res.send('HelloWorld')
    
}; */
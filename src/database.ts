import {connect, ConnectOptions} from "mongoose";



export async function startConnection() {
    await connect('mongodb://localhost:/photo-galleryDB', {
    /* uuseNewUrlParser: true,
    useFindAndModify: false */
  } as ConnectOptions);
  console.log('Database is connected');
};
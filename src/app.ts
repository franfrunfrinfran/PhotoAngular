import express from "express";
import morgan from "morgan";
import path from "path";
import cors from 'cors';


const app = express();

import photoRoutes from './routes/photo.routes';
import authRoutes from './routes/auth.routes';

//settings
app.set('port', process.env.PORT || 3000);

//MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//routes
app.use('/api',photoRoutes);
app.use('/api/auth', authRoutes);

//Folder where will be used to store public files
app.use('/uploads',express.static(path.resolve('uploads')))
//app.use('/uploads', express.static('uploads'))

export default app;
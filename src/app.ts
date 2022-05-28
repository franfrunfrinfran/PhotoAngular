import express from "express";
import morgan from "morgan";
import path from "path";


const app = express();

import indexRoutes from './routes/index';

//settings
app.set('port', process.env.PORT || 3000);

//MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use('/api',indexRoutes);

//Folder where will be used to store public files
app.use('/uploads',express.static(path.resolve('../uploads')))


export default app;
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import _ from 'lodash';
import { DB } from './src/db/connect/connectToMongoDB'
import emailRoutes from './src/router/EmailRoutes'
dotenv.config();


const app: Express = express();
const port = 9002;

// Initialize the app by connecting to DB and starting the server
const init = async () => {
    await DB();
    startServer();
};


init().catch(err => {
    console.error('Initialization failed:', err);
});

app.use('/email', emailRoutes)
const startServer = () => {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
};

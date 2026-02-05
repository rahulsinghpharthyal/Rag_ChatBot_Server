import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { FRONTEND_URL1, FRONTEND_URL2 } from './config/env.js';

const app = express();

app.use(express.json());

app.use(cors(
    {
        origin: [FRONTEND_URL1, FRONTEND_URL2],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }
))

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }
))

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;

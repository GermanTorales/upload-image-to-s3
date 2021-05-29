import express from 'express';
import addRoutes from '../routes/index.js';
import { apiLogging, morganConfig } from '../config/morganConfig.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morganConfig);
app.use(apiLogging);

addRoutes(app);

export default app;

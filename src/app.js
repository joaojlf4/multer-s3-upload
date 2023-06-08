import express from 'express';
import cors from 'cors';
import routes from './routes';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(morgan(":method :url :response-time :status"));
app.use(morgan("dev"));
app.use('/files', express.static(path.resolve(__dirname, 'tmp', 'uploads'),))
app.use(routes);

export default app;
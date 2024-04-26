import * as dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import morgan from 'morgan';

import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import jobRouter from './routes/jobRouter.js';

dotenv.config();

const app = express();

//routers

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post(
  '/api/v1/test',
  [body('name').notEmpty().withMessage('name is required')],
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  },
  (req, res) => {
    const { name } = req.body;
    res.json({ message: `hello ${name}` });
  }
);

app.use('/api/v1/jobs', jobRouter);

app.use('*', (req, res) => {
  req.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit;
}

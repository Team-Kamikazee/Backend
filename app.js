import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import xss from 'xss';
import mongoSanitize from 'express-mongo-sanitize';
import router from './routes';

const app = express();

//serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//implement cors
app.use(cors());
app.options('*', cors());

//security headers
app.use(helmet());

// rate limiters
const rateLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this ip , please try again in an hour',
});

app.use('/api/', router);

export default app;

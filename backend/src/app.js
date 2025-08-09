import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';
app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
const useWildcardOrigin = CLIENT_ORIGIN === '*' || CLIENT_ORIGIN === 'null';
const corsOptions = useWildcardOrigin ? { origin: '*' } : { origin: CLIENT_ORIGIN, credentials: true };
app.use(cors(corsOptions));
app.use(express.json());

// health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ecommerce-backend', timestamp: new Date().toISOString() });
});

// routes
app.use('/', router);

export default app;



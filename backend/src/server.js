import 'dotenv/config';
import app from './app.js';
import { syncAndSeed } from './db/index.js';

const PORT = process.env.PORT || 3000;

await syncAndSeed();

app.listen(PORT, () => {
  console.log(`[server] listening on http://0.0.0.0:${PORT}`);
});



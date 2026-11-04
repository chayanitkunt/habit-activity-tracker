import { createApp } from './app.js';
import { loadConfig } from './config/env.js';

const config = loadConfig();
const port = Number(process.env.PORT || 3000);

createApp().listen(port, () => {
  console.log(`API listening on port ${port} (${config.appEnv})`);
});

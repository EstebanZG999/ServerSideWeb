import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Definiendo __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logRequest = (req, res, next) => {
  const { method, url, body } = req;
  const start = new Date();

  res.on('finish', () => {
    const duration = new Date() - start;
    const logMessage = `${start.toISOString()}, ${method} ${url}, Payload: ${JSON.stringify(body)}, Status: ${res.statusCode}, Duration: ${duration}ms\n`;

    // Usar __dirname definido previamente para especificar la ruta al archivo de log
    fs.appendFile(path.join(__dirname, 'log.txt'), logMessage, (err) => {
      if (err) {
        console.error('Error logging request:', err);
      }
    });
  });

  next();
};

export default logRequest;

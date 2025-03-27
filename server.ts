import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import products from './api/routes/products';
import inventories from './api/routes/inventories';
import stores from './api/routes/stores';
import sales from './api/routes/sales';
import units from './api/routes/units';
import categories from './api/routes/categories';
import suppliers from './api/routes/suppliers';
import requests from './api/routes/requests';
import purchases from './api/routes/purchases';
import users from './api/routes/user';
import expired from './api/routes/expired';

dotenv.config();

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();
  server.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Headers', ['*']);
    res.append('Access-Control-Allow-Methods', [
      'PUT',
      'GET',
      'HEAD',
      'POST',
      'DELETE',
      'OPTIONS',
    ]);

    next();
  });
  server.use(express.json());
  server.use('/api/products', products);
  server.use('/api/stores', stores);
  server.use('/api/inventories', inventories);
  server.use('/api/sales', sales);
  server.use('/api/units', units);
  server.use('/api/categories', categories);
  server.use('/api/requests', requests);
  server.use('/api/purchases', purchases);
  server.use('/api/suppliers', suppliers);
  server.use('/api/users', users);
  server.use('/api/expired', expired);

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    })
  );

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const DATABASE_URL = process.env['DATABASE_URL'] as string;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
    mongoose
      .connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(`database ${DATABASE_URL} connected successfully`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
}

run();

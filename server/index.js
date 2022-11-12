require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const uploadsMiddleware = require('./uploads-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(express.json());
app.use(staticMiddleware);

app.get('/api/runs', (req, res, next) => {
});

app.post('/api/uploads', uploadsMiddleware, (req, res, next) => {
  res.status(201).json({ url: '/images/' + req.file.filename });
});

app.post('/api/runs', (req, res, next) => {
  const { beforeImageUrl, afterImageUrl, routeImageUrl, distance, time, arrayOfCoords } = req.body;

  if (!beforeImageUrl || !afterImageUrl || !routeImageUrl || !distance || !time || !arrayOfCoords) {
    throw new ClientError(400, 'Missing one of the images, distance, time, or coordinates');
  }

  const sql = `
  insert into "public"."runs" ("accountId", "beforeImageUrl", "afterImageUrl", "routeImageUrl", "distance", "time", "arrayOfCoords")
  values (1, $1, $2, $3, $4, $5, $6)
  `;
  const params = [beforeImageUrl, afterImageUrl, routeImageUrl, distance, time, arrayOfCoords];

  db.query(sql, params)
    .then(result => {
      res.statusCode(201);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});

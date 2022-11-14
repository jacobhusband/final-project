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
  const sql = `
  select *
  from "runs"
  where "accountId" = $1;
  `;
  const params = ['1'];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/uploads', uploadsMiddleware, (req, res, next) => {
  if (req.file.filename) {
    res.status(201).json({ url: '/images/' + req.file.filename });
  } else {
    throw new ClientError(500, 'Unexpected error occurred');
  }
});

app.post('/api/runs', (req, res, next) => {
  const { preImageUrl, postImageUrl, mapImg, distance, time, latlng } = req.body;

  if (preImageUrl === undefined || postImageUrl === undefined || mapImg === undefined || distance === undefined || time === undefined || latlng === undefined) {
    throw new ClientError(400, 'Missing one of the images, distance, time, or coordinates');
  }

  const sql = `
  insert into "public"."runs" ("accountId", "beforeImageUrl", "afterImageUrl", "routeImageUrl", "distance", "time", "arrayOfCoords")
  values (1, $1, $2, $3, $4, $5, $6);
  `;
  const params = [preImageUrl, postImageUrl, mapImg, distance, time, JSON.stringify(latlng)];

  db.query(sql, params)
    .then(result => {
      res.status(201).json({ message: 'Success' });
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});

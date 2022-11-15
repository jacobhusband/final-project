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

app.get('/api/run/:runId', (req, res, next) => {
  const sql = `
  select *
  from "runs"
  where "accountId" = $1 AND
        "runId" = $2;
  `;
  const params = ['1', req.params.runId];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/runs', (req, res, next) => {
  const { preImageUrl, postImageUrl, mapImg, distance, time, latlng, pace } = req.body;

  if (preImageUrl === undefined || postImageUrl === undefined || mapImg === undefined || distance === undefined || time === undefined || latlng === undefined || pace === undefined) {
    throw new ClientError(400, 'Missing one of the images, distance, time, or coordinates');
  }

  const sql = `
    insert into "public"."runs" ("accountId", "beforeImageUrl", "afterImageUrl", "routeImageUrl", "distance", "time", "arrayOfCoords", "pace")
    values (1, $1, $2, $3, $4, $5, $6, $7)
    returning *;
  `;

  const params = [preImageUrl, postImageUrl, mapImg, distance, time, JSON.stringify(latlng), pace];

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/posts', (req, res, next) => {

  const { caption, runId, beforeImageUrlOrder, routeImageUrlOrder, afterImageUrlOrder, beforeImageUrlShowing, routeImageUrlShowing, afterImageUrlShowing } = req.body;

  if (caption === undefined || runId === undefined || beforeImageUrlOrder === undefined || routeImageUrlOrder === undefined || afterImageUrlOrder === undefined || beforeImageUrlShowing === undefined || routeImageUrlShowing === undefined || afterImageUrlShowing === undefined) {
    throw new ClientError(400, 'Missing caption, runId, image order, or image showing.');
  }

  const sql = `
    insert into "public"."posts" ("runId", "caption", "beforeImageUrlOrder", "routeImageUrlOrder", "afterImageUrlOrder", "beforeImageShowing", "routeImageShowing", "afterImageShowing")
    values ($1, $2, $3, $4, $5, $6, $7, $8)
    returning *;
  `;

  const params = [runId, caption, beforeImageUrlOrder, routeImageUrlOrder, afterImageUrlOrder, beforeImageUrlShowing, routeImageUrlShowing, afterImageUrlShowing];

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/posts', (req, res, next) => {

  const sql = `
    select *
    from "posts"
    join "runs" using ("runId")
    order by "postedAt";
  `;

  db.query(sql)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(err => next(err));

});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});

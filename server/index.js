require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const uploadsMiddleware = require('./uploads-middleware');
const argon2 = require('argon2');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(express.json());
app.use(staticMiddleware);

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }

  let hashedPassword;
  argon2
    .hash(password)
    .then(response => {
      hashedPassword = response;

      const sql = `
        insert into "accounts" ("username", "hashedPassword")
        values ($1, $2)
        returning *;
      `;

      const params = [username, hashedPassword];

      db.query(sql, params)
        .then(result => {
          delete result.rows[0].hashedPassword;
          res.status(201).json(result.rows[0]);
          return result.rows;
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(err);
    });
});

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

  const { caption, runId, images } = req.body;

  if (caption === undefined || runId === undefined || images === undefined) {
    throw new ClientError(400, 'Missing caption, runId, image order, or image showing.');
  }

  const sql = `
    insert into "public"."posts" ("runId", "caption", "images")
    values ($1, $2, $3)
    returning *;
  `;

  const params = [runId, caption, JSON.stringify(images)];

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
    join "accounts" using ("accountId")
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

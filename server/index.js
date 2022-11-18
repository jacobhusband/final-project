require('dotenv/config');
const pg = require('pg');
const express = require('express');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const uploadsMiddleware = require('./uploads-middleware');
const authorizationMiddleware = require('./authorization-middleware');
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

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "accountId",
           "hashedPassword"
      from "accounts"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { accountId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { accountId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.post('/api/auth/dummy-sign-in', (req, res, next) => {
  const { username } = req.body;

  const sql = `
    select "accountId",
           "hashedPassword"
      from "accounts"
     where "username" = $1
  `;

  const params = [username];

  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      const { accountId } = user;
      const payload = { accountId, username };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET);
      res.json({ token, user: payload });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.get('/api/runs', (req, res, next) => {

  const sql = `
  select *
  from "runs"
  `;

  db.query(sql)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/runs/:accountId', (req, res, next) => {

  if (parseInt(req.params.accountId) !== req.user.accountId) {
    throw new ClientError(400, 'accountId posted for does not match user accountId');
  }

  const sql = `
  select *
  from "runs"
  where "accountId" = $1
  `;

  const params = [req.params.accountId];

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

app.get('/api/run/:accountId/:runId', (req, res, next) => {

  if (parseInt(req.params.accountId) !== req.user.accountId) {
    throw new ClientError(400, 'accountId posted for does not match user accountId');
  }

  const sql = `
  select *
  from "runs"
  where "accountId" = $1 AND
        "runId" = $2;
  `;

  const params = [req.params.accountId, req.params.runId];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/run/:accountId', (req, res, next) => {
  const { preImageUrl, postImageUrl, mapImg, distance, time, latlng, pace } = req.body;

  if (parseInt(req.params.accountId) !== req.user.accountId) {
    throw new ClientError(400, 'accountId posted for does not match user accountId');
  }

  if (preImageUrl === undefined || postImageUrl === undefined || mapImg === undefined || distance === undefined || time === undefined || latlng === undefined || pace === undefined) {
    throw new ClientError(400, 'Missing one of the images, distance, time, or coordinates');
  }

  const sql = `
    insert into "public"."runs" ("accountId", "beforeImageUrl", "afterImageUrl", "routeImageUrl", "distance", "time", "arrayOfCoords", "pace")
    values ($8, $1, $2, $3, $4, $5, $6, $7)
    returning *;
  `;

  const params = [preImageUrl, postImageUrl, mapImg, distance, time, JSON.stringify(latlng), pace, req.params.accountId];

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/post/:runId', (req, res, next) => {

  const { caption, images } = req.body;

  if (caption === undefined || images === undefined) {
    throw new ClientError(400, 'Missing caption, runId, image order, or image showing.');
  }

  const sqlVerify = `
    select "accountId"
    from "posts"
    join "runs" using ("runId")
    join "accounts" using ("accountId")
    where "accountId" = $1 AND
          "runId" = $2;
  `;

  const paramsVerify = [req.user.accountId, req.params.runId];

  const sql = `
    insert into "public"."posts" ("runId", "caption", "images")
    values ($1, $2, $3)
    returning *;
  `;
  const params = [req.params.runId, caption, JSON.stringify(images)];

  db.query(sqlVerify, paramsVerify)
    .then(result => {
      return db.query(sql, params);
    })
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
    order by "postedAt" DESC;
  `;

  db.query(sql)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(err => next(err));

});

app.get('/api/post/:postId', (req, res, next) => {
  const postId = parseInt(req.params.postId);
  const accId = req.user.accountId;

  const sql = `
    select "posts".*, "runs".*, "accountId"
    from "posts"
    join "runs" using ("runId")
    join "accounts" using ("accountId")
    where "postId" = $1;
  `;

  const params = [postId];

  db.query(sql, params)
    .then(result => {
      if (result.rows[0].accountId === accId) {
        res.status(201).json(result.rows[0]);
      } else {
        throw new ClientError(400, 'Not logged in to the right account');
      }
    })
    .catch(err => next(err));

});

app.put('/api/post/:postId', (req, res, next) => {

  const { caption, images } = req.body;

  if (caption === undefined || images === undefined) {
    throw new ClientError(400, 'Missing caption, runId, image order, or image showing.');
  }

  if (images.length !== 3) {
    throw new ClientError(400, 'Incorrect amount of image objects');
  }

  const postId = parseInt(req.params.postId);
  const accId = req.user.accountId;

  const sqlVerify = `
    select "accountId"
    from "posts"
    join "runs" using ("runId")
    join "accounts" using ("accountId")
    where "accountId" = $1 AND
          "postId" = $2;
  `;

  const paramsVerify = [accId, postId];

  const sql = `
    update "posts"
       set "caption" = $1,
           "images" = $2
     where "postId" = $3
     returning *;
  `;

  const params = [caption, JSON.stringify(images), postId];

  db.query(sqlVerify, paramsVerify)
    .then(result => {
      return db.query(sql, params);
    })
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));

});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});

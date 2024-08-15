const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
router.post('/register', async (req, res, next) => {
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = encryptLib.encryptPassword(req.body.password);
  const role = req.body.role;
  const disciplines = req.body.disciplines || [];

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userCheckQuery = `SELECT id FROM "user" WHERE username = $1`;
    const userCheckResult = await client.query(userCheckQuery, [username]);

    if (userCheckResult.rows.length > 0) {
      res.status(409).json({message: 'Username already exists.'});
      await client.query('ROLLBACK');
      return
    }
  

  const userInsertQuery = `INSERT INTO "user" (username, firstname, lastname, password, role)
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const userResult = await client.query(userInsertQuery, [username, firstname, lastname, password, role]);
    const userId = userResult.rows[0].id;
 
    if (role === 'tutor' && disciplines.length > 0) { 
      const disciplineInsertQuery = `INSERT INTO "user_disciplines" (discipline_id, user_id) VALUES ($1, $2)`;
      for (let discipline of disciplines) {
        await client.query(disciplineInsertQuery, [discipline, userId]);
      }
    }
    await client.query('COMMIT'); 
    res.sendStatus(201);
  } catch (err) {
    await client.query('ROLLBACK');
    console.log('User registration failed: ', err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

module.exports = router;

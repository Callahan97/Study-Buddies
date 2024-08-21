const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, async (req, res) => {
  try {
    const userId = req.user.id;

    const userQuery = `
      SELECT u.id, u.firstname, u.lastname, u.username, u.role, d.name as discipline
      FROM "user" u
      LEFT JOIN user_disciplines ud ON ud.user_id = u.id
      LEFT JOIN disciplines d ON d.id = ud.discipline_id
      WHERE u.id = $1
    `;

    const userResult = await pool.query(userQuery, [userId]);
    const user = userResult.rows[0];

    res.send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.sendStatus(500);
  }
});

// Handles POST request with new user data
router.post('/register', async (req, res, next) => {
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = encryptLib.encryptPassword(req.body.password);
  const role = req.body.role;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userInsertQuery = `INSERT INTO "user" (username, firstname, lastname, password, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const userResult = await client.query(userInsertQuery, [username, firstname, lastname, password, role]);
    const userId = userResult.rows[0].id;

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


router.put('/', rejectUnauthenticated, async (req, res) => {
  const { username, firstname, lastname, password } = req.body;
  const userId = req.user.id;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let updateQuery;
    let queryValues;

    if (password) {
      const encryptedPassword = encryptLib.encryptPassword(password);
      updateQuery = `
        UPDATE "user" 
        SET username = $1, firstname = $2, lastname = $3, password = $4
        WHERE id = $5`;
      queryValues = [username, firstname, lastname, encryptedPassword, userId];
    } else {
      updateQuery = `
        UPDATE "user" 
        SET username = $1, firstname = $2, lastname = $3
        WHERE id = $4`;
      queryValues = [username, firstname, lastname, userId];
    }

    await client.query(updateQuery, queryValues);

    await client.query('COMMIT');
    res.sendStatus(200);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating user profile:', err);
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

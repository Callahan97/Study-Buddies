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

router.get('/disciplines', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM disciplines');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching disciplines:', err);
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
  const discipline = req.body.discipline || '';

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userInsertQuery = `INSERT INTO "user" (username, firstname, lastname, password, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const userResult = await client.query(userInsertQuery, [username, firstname, lastname, password, role]);
    const userId = userResult.rows[0].id;

    if (role === 'tutor' && discipline) {
      const disciplineCheckQuery = `SELECT id FROM disciplines WHERE name = $1`;
      let disciplineIdResult = await client.query(disciplineCheckQuery, [discipline]);

      if (disciplineIdResult.rows.length === 0) {
        const disciplineInsertQuery = `INSERT INTO disciplines (name) VALUES ($1) RETURNING id`;
        disciplineIdResult = await client.query(disciplineInsertQuery, [discipline]);
      }
      const disciplineId = disciplineIdResult.rows[0].id;

      const associateDisciplineQuery = `INSERT INTO user_disciplines (user_id, discipline_id) VALUES ($1, $2)`;
      await client.query(associateDisciplineQuery, [userId, disciplineId]);
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


router.put('/', rejectUnauthenticated, async (req, res) => {
  const { username, firstname, lastname, password, discipline } = req.body;
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

    if (req.user.role === 'tutor' && discipline) {
      const disciplineCheckQuery = `SELECT id FROM disciplines WHERE name = $1`;
      let disciplineIdResult = await client.query(disciplineCheckQuery, [discipline]);

      if (disciplineIdResult.rows.length === 0) {
        const disciplineInsertQuery = `INSERT INTO disciplines (name) VALUES ($1) RETURNING id`;
        disciplineIdResult = await client.query(disciplineInsertQuery, [discipline]);
      }

      const disciplineId = disciplineIdResult.rows[0].id;

      await client.query('DELETE FROM user_disciplines WHERE user_id = $1', [userId]);
      const associateDisciplineQuery = `INSERT INTO user_disciplines (user_id, discipline_id) VALUES ($1, $2)`;
      await client.query(associateDisciplineQuery, [userId, disciplineId]);
    }

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

const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

const router = express.Router();


router.get('/', rejectUnauthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM disciplines');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching disciplines:', err);
    res.sendStatus(500);
  }
});

// GET the discipline for a specific user
router.get('/user/:id', rejectUnauthenticated, async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT d.name FROM disciplines d
       JOIN user_disciplines ud ON d.id = ud.discipline_id
       WHERE ud.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user disciplines:', err);
    res.sendStatus(500);
  }
});

// UPDATE user's discipline
router.put('/user/:id', rejectUnauthenticated, async (req, res) => {
  const userId = req.params.id;
  const { discipline } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

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

    await client.query('COMMIT');
    res.sendStatus(200);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating user discipline:', err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

module.exports = router;
const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM tutor_availability WHERE user_id = $1`;
  pool.query(queryText, [req.user.id])
    .then(result => res.json(result.rows))
    .catch(error => {
      console.error('Error fetching availability:', error);
      res.sendStatus(500);
    });
});

router.put('/', rejectUnauthenticated, (req, res) => {
  const availability = req.body;
  const userId = req.user.id;

  const queryText = `DELETE FROM tutor_availability WHERE user_id = $1`;
  pool.query(queryText, [userId])
    .then(() => {
      const insertQuery = `
        INSERT INTO tutor_availability (user_id, day_of_week, start_time, end_time, duration)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const insertPromises = availability.map(slot => {
        console.log(`Inserting: ${JSON.stringify(slot)}`);
        return pool.query(insertQuery, [userId, slot.day, slot.startTime, slot.endTime, slot.duration]);
      });
      return Promise.all(insertPromises);
    })
    .then(() => res.sendStatus(200))
    .catch(error => {
        console.error('Error updating availability:', error.stack);
      res.sendStatus(500);
    });
});

module.exports = router;
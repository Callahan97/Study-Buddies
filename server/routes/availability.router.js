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

router.get('/week', rejectUnauthenticated, (req, res) => {
  const { startDate, endDate, discipline } = req.query;

  const queryText = `
    SELECT u.firstname, u.lastname, ta.day_of_week, ta.start_time, ta.end_time
    FROM tutor_availability ta
    JOIN "user" u ON ta.user_id = u.id
    JOIN user_disciplines ud ON ud.user_id = u.id
    JOIN disciplines d ON d.id = ud.discipline_id
    WHERE d.name = $1 AND ta.day_of_week >= $2 AND ta.day_of_week <= $3
  `;

  pool.query(queryText, [discipline, startDate, endDate])
    .then(result => res.json(result.rows))
    .catch(error => {
      console.error('Error fetching availability for the week:', error);
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
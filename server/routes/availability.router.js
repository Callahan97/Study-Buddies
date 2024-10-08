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
  const { startTime, endTime, discipline } = req.query;

  console.log('Received query params:', { startTime, endTime, discipline });

  const queryText = `
    SELECT u.id AS tutor_id, u.firstname, u.lastname, ta.day_of_week, ta.start_time, ta.end_time
    FROM tutor_availability ta
    JOIN "user" u ON ta.user_id = u.id
    JOIN user_disciplines ud ON ud.user_id = u.id
    JOIN disciplines d ON d.id = ud.discipline_id
    WHERE d.name = $1 
      AND ta.start_time >= $2 
      AND ta.end_time <= $3
  `;

  pool.query(queryText, [discipline, startTime, endTime])
  .then(result => {
    console.log('Availability results:', result.rows);
    res.json(result.rows);
  })
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

router.post('/book', rejectUnauthenticated, (req, res) => {
  const { tutor_id, tutee_id, start_time, end_time, date } = req.body;
  const queryText = `
    INSERT INTO bookings (tutor_id, tutee_id, start_time, end_time, date)
    VALUES ($1, $2, $3, $4, $5)
  `;

  pool.query(queryText, [tutor_id, tutee_id, start_time, end_time, date])
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.error('Error booking session:', error);
      res.sendStatus(500);
    });
});

router.get('/bookings', rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT b.id, b.date, b.start_time, b.end_time, u.firstname AS tutor_firstname, u.lastname AS tutor_lastname
    FROM bookings b
    JOIN "user" u ON b.tutor_id = u.id
    WHERE b.tutee_id = $1
    ORDER BY b.date ASC, b.start_time ASC
  `;

  pool.query(queryText, [req.user.id])
    .then(result => res.json(result.rows))
    .catch(error => {
      console.error('Error fetching bookings:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
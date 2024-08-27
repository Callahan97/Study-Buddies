const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


router.get('/', rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;

  console.log('Fetching booked sessions for user ID:', userId); 

  const queryText = `
    SELECT b.id, b.tutor_id, b.tutee_id, b.start_time, b.end_time, b.date, 
           tutor.firstname AS tutor_firstname, tutor.lastname AS tutor_lastname, 
           tutee.firstname AS tutee_firstname, tutee.lastname AS tutee_lastname
    FROM bookings b
    JOIN "user" tutor ON b.tutor_id = tutor.id
    JOIN "user" tutee ON b.tutee_id = tutee.id
    WHERE b.tutor_id = $1 OR b.tutee_id = $1
    ORDER BY b.date, b.start_time;
  `;

  pool.query(queryText, [userId])
    .then(result => {
      console.log('Booked sessions result:', result.rows); 
      res.json(result.rows);
    })
    .catch(error => {
      console.error('Error fetching booked sessions:', error);
      res.sendStatus(500);
    });
});

router.post('/', rejectUnauthenticated, (req, res) => {
  const { tutor_id, tutee_id, start_time, end_time, date } = req.body;

  const queryText = `
    INSERT INTO bookings (tutor_id, tutee_id, start_time, end_time, date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;
  
  pool.query(queryText, [tutor_id, tutee_id, start_time, end_time, date])
    .then(result => res.status(201).json({ bookingId: result.rows[0].id }))
    .catch(error => {
      console.error('Error creating booking:', error);
      res.sendStatus(500);
    });
});

module.exports = router;

router.delete('/:id', rejectUnauthenticated, (req, res) => {
  const bookingId = req.params.id;

  const queryText = `
    DELETE FROM bookings
    WHERE id = $1 AND (tutor_id = $2 OR tutee_id = $2)
  `;

  pool.query(queryText, [bookingId, req.user.id])
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.error('Error deleting booking:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
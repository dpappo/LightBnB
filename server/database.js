const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  if (!email) {
    return null;
  }
  return pool.query('SELECT * FROM users WHERE email = $1',[email])
    .then(res => {
      return res.rows[0];
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  if (!id) {
    return null;
  }
  
  return pool.query('SELECT * FROM users WHERE id = $1',[id])
    .then(res => {
      return res.rows[0];
    });
  
  // return Promise.resolve(users[id]);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const {name, email, password} = user;

  return pool.query(`INSERT INTO users (name, email, password) 
  VALUES ($1, $2, $3)
  RETURNING *;`, [name, email, password])
    .then(res => res.rows[0])
    .catch(console.error);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`SELECT reservations.*, properties.*, avg(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1 AND reservations.end_date <= now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT 10;`,[guest_id])
    .then(res => {
      return res.rows;
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    if (options.city) {
      queryString += `AND rating >= $${queryParams.length} `;
    } else {
      queryString += `WHERE rating >= $${queryParams.length} `;
    }
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    if (!options.city && !options.minimum_rating) {
      queryString += `WHERE cost_per_night > $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night > $${queryParams.length} `;
    }
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    if (!options.city && !options.minimum_rating && !options.minimum_price_per_night) {
      queryString += `WHERE cost_per_night < $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night < $${queryParams.length} `;
    }
  }


  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;


  // console.log("queryString", queryString);
  // console.log("queryParams", queryParams);
  // console.log("options", options);

  return pool.query(queryString, queryParams)
    .then(res => res.rows);
  
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;

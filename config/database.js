const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();


// import { Sequelize } from 'sequelize';
// import fs from 'fs';
const fs = require('fs');
// import dotenv from 'dotenv';

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT || 5432;
const DB_DIALECT = process.env.DB_DIALECT || 'postgres';

if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME) {
  throw new Error('Missing required database environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
}

console.log(`Connecting to database: ${DB_NAME} at ${DB_HOST}:${DB_PORT}`);

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASS,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        ca: fs.readFileSync('./certs/server-ca.pem').toString(),
        key: fs.readFileSync('./certs/client-key.pem').toString(),
        cert: fs.readFileSync('./certs/client-cert.pem').toString(),
      },
    },
    logging: false,
  }
);

// export default sequelize;
// const sequelize = new Sequelize(process.env.DB_URL, {
//   dialect: 'postgres',
//   protocol: 'postgres',
//   logging: false,
//   define: {
//     timestamps: true,
//     underscored: true,
//   },
// });

// Test connection function
const testDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connected to ${DB_DIALECT} database at ${DB_HOST}:${DB_PORT}`);
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Export the sequelize instance as default export
module.exports = sequelize;

// Export test function separately if needed
module.exports.testDBConnection = testDBConnection;

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();
const fs = require('fs');

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

/**
 * Load SSL certificate/key from environment variable or file path.
 * Supports both inline PEM content (with \n as literal string or escaped newlines)
 * and file paths.
 * 
 * @param {string} contentEnvVar - Environment variable name containing PEM content
 * @param {string} pathEnvVar - Environment variable name containing file path
 * @param {string} description - Description for error messages
 * @returns {string|null} - PEM content or null if not configured
 */
function loadSSLFile(contentEnvVar, pathEnvVar, description) {
  const content = process.env[contentEnvVar];
  const path = process.env[pathEnvVar];

  if (content) {
    // Handle both literal \n in env var and actual newlines
    // Replace literal \n string with actual newlines
    return content.replace(/\\n/g, '\n');
  }

  if (path) {
    try {
      return fs.readFileSync(path, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read ${description} from path '${path}': ${error.message}`);
    }
  }

  return null;
}

// Load SSL certificates/keys from environment variables or file paths
const sslCA = loadSSLFile('DB_SSL_CA', 'DB_SSL_CA_PATH', 'SSL CA certificate');
const sslKey = loadSSLFile('DB_SSL_KEY', 'DB_SSL_KEY_PATH', 'SSL client key');
const sslCert = loadSSLFile('DB_SSL_CERT', 'DB_SSL_CERT_PATH', 'SSL client certificate');

// Determine if SSL is configured
const sslConfigured = sslCA || sslKey || sslCert;

// Build dialectOptions based on SSL configuration
let dialectOptions = {};

if (sslConfigured) {
  // SSL is partially or fully configured
  if (!sslCA || !sslKey || !sslCert) {
    const missing = [];
    if (!sslCA) missing.push('DB_SSL_CA or DB_SSL_CA_PATH');
    if (!sslKey) missing.push('DB_SSL_KEY or DB_SSL_KEY_PATH');
    if (!sslCert) missing.push('DB_SSL_CERT or DB_SSL_CERT_PATH');
    
    throw new Error(
      `Incomplete SSL configuration. All three SSL components are required when SSL is enabled.\n` +
      `Missing: ${missing.join(', ')}\n` +
      `Either provide all SSL environment variables or none to disable SSL.`
    );
  }

  console.log('Database SSL: Enabled (using environment-provided certificates)');
  dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      ca: sslCA,
      key: sslKey,
      cert: sslCert,
    },
  };
} else {
  // No SSL configuration provided
  console.log('Database SSL: Disabled (no SSL certificates configured)');
  // dialectOptions remains empty, SSL will not be used
}

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASS,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    dialectOptions,
    logging: false,
  }
);

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

var Sequelize = require('sequelize');
import 'dotenv/config'

const sequelize = new Sequelize(process.env.DB_NAME ?? '', process.env.DB_USER ?? '', process.env.DB_PASS ?? '', {
    dialect: 'mssql',
    // driver: 'tedious',
    options: {
        encrypt: true,
        database: 'process.env.DB_NAME'
      },
    host: process.env.DB_HOST,
    port: 1433
});

export {
    sequelize
}
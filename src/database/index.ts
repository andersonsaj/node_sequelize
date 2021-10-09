import {Sequelize} from 'sequelize';


export const database = new Sequelize(
    {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    define: {
        timestamps: false
    }
    });
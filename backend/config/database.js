import { Sequelize } from "sequelize";

const db = new Sequelize('crud_db','root','',{
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
});

(async () => {
    try {
      await db.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();

export default db;
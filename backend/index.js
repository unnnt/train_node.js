import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js"
import db from './config/database.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRoute);

app.listen(5000, () => console.log('server up and running'));

(async () => {
    try {
      await db.authenticate();
      console.log('Connection has been established successfully.');
      await db.sync(); // Sync database
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();
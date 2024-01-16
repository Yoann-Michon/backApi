import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, DataTypes} from "sequelize";
import { authRouter } from "./router/auth";
import { userRouter } from "./router/users";



const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/database.sqlite'
});

export const User = sequelize.define('user', {
  login: DataTypes.STRING,
  password: DataTypes.CHAR
}, { timestamps: false});

// sequelize.sync({ force: true });
sequelize.sync();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});

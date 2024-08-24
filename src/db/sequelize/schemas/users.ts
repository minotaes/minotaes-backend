import { sequelize } from "../index.js";
import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";

export class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare userId: CreationOptional<number>;
  declare email: string;
  declare password: string;
}

Users.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "users",
  },
);

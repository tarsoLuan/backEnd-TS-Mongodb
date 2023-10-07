import { Model, Optional, DataTypes } from "sequelize";
import { sequelize } from "../database/db"

interface IUser{
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type userCreationAttributes = Optional<IUser, "id">;

export class User extends Model<IUser, userCreationAttributes> {
    public id: number | undefined;
    public username: string | undefined;
    public name: string | undefined;
    public email: string | undefined;
    public password: string | undefined;
    public isActive: boolean | undefined;
    public readonly createdAt: Date | undefined;
    public readonly updatedAt: Date | undefined;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        password: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        createdAt: {
            type: new DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        updatedAt: {
            type: new DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    },
    {
        sequelize,
        tableName: "User",
        modelName: "User"
    }
)

User.sync()
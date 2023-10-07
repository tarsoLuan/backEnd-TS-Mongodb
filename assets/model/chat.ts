import { Model, Optional, DataTypes } from "sequelize";
import { sequelize } from "../database/db"

export interface IChat{
    id: number;
    user_consumer: number;
    user_receiver: number;
    prediction: boolean;
    message: string;
    createdAt?: Date;
}

export type ChatCreationAttributes = Optional<IChat, 'id'>;

export class Chat extends Model<IChat, ChatCreationAttributes> implements IChat {
    public id: number;
    public user_consumer: number;
    public user_receiver: number;
    public message: string;
    public prediction: boolean;

    public readonly createdAt: Date;
    public readonly updatedAt: Date;
}

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_consumer: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_receiver: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        prediction: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        message: {
            type: new DataTypes.STRING(4000),
            allowNull: false
        },
        createdAt: {
            type: new DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    },
    {
        sequelize,
        tableName: "Chat",
        modelName: "Chat"
    }
)

Chat.sync()
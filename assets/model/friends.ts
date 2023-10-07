import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/db";

interface IFriend {
    id: number;
    UserId: number;
    FriendId: number;
}

export type FriendCreationAttributes = Optional<IFriend, "id">;

export class Friend extends Model<IFriend, FriendCreationAttributes> implements IFriend {
    public id: number;
    public UserId: number;
    public FriendId: number;

    public readonly createdAt: Date;
    public readonly updatedAt: Date;
}

Friend.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: "User",
                key: "id"
            },

            allowNull: false
        },
        FriendId: {
            type: DataTypes.INTEGER,
            references: {
                model: "User",
                key: "id"
            },
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "Friend",
        modelName: "Friend"
    }
)

Friend.sync()
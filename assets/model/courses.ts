import { Model, Optional, DataTypes } from "sequelize";
import { sequelize } from "../database/db"

interface ICourse{
    id: number;
    name: string;
    description: string;
    status: boolean;
    remainingVacancies: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CourseCreationAttributes = Optional<ICourse, "id">;

export class Course extends Model<ICourse, CourseCreationAttributes> {
    public id: number | undefined;
    public name: string | undefined;
    public description: string | undefined;
    public status: boolean | undefined;
    public remainingVacancies: number | undefined;
    public readonly createdAt: Date | undefined;
    public readonly updatedAt: Date | undefined;
}

Course.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        description: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        remainingVacancies: {
            type: DataTypes.INTEGER,
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
        tableName: "Course",
        modelName: "Course"
    }
)

Course.sync()
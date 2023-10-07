import { Model, Optional, DataTypes } from "sequelize";
import { sequelize } from "../database/db"

interface IEnrollment{
    id: number;
    UserId: number;
    CourseId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type EnrollmentCreationAttributes = Optional<IEnrollment, "id">;

export class Enrollment extends Model<IEnrollment, EnrollmentCreationAttributes> {
    public id: number | undefined;
    public UserId: number | undefined;
    public CourseId: number | undefined;
    public readonly createdAt: Date | undefined;
    public readonly updatedAt: Date | undefined;

}

Enrollment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User",
                key: "id"
            }
        },
        CourseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Course",
                key: "id"
            }
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
        modelName: "Enrollment",
        tableName: "Enrollment",
        sequelize
    }
);

Enrollment.sync()
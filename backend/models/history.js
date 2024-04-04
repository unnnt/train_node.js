import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class UserHistory extends Model {}

UserHistory.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    columnChanged: {
        type: DataTypes.STRING,
        allowNull: false
    },
    oldValue: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    newValue: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'user_history'
});

export default UserHistory;

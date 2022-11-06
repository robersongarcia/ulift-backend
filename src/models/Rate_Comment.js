const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Rate_Comment.init(sequelize, DataTypes);
}

class Rate_Comment extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    passengerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Lift',
        key: 'passengerID'
      }
    },
    driverID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Lift',
        key: 'driverID'
      }
    },
    plate: {
      type: DataTypes.STRING(7),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Lift',
        key: 'plate'
      }
    },
    liftID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Lift',
        key: 'liftID'
      }
    },
    LiftComment: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Rate_Comment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "passengerID" },
          { name: "driverID" },
          { name: "plate" },
          { name: "liftID" },
        ]
      },
    ]
  });
  }
}

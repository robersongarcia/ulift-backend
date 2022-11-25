const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Lift.init(sequelize, DataTypes);
}

class Lift extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    passengerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    driverID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Vehicle',
        key: 'driverID'
      }
    },
    plate: {
      type: DataTypes.STRING(7),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Vehicle',
        key: 'plate'
      }
    },
    liftID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dateL: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    timeL: {
      type: DataTypes.TIME,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Lift',
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
      {
        name: "Lift_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "driverID" },
          { name: "plate" },
        ]
      },
    ]
  });
  }
}

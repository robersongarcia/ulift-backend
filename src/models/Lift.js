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
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('cast(current_timestamp() - interval 4 hour as date)')
    },
    timeL: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('cast(current_timestamp() - interval 4 hour as time)')
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rdNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    complete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    driverCheck: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'Lift',
    hasTrigger: true,
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

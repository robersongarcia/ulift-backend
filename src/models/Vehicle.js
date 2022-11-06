const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Vehicle.init(sequelize, DataTypes);
}

class Vehicle extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    driverID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    plate: {
      type: DataTypes.STRING(7),
      allowNull: false,
      primaryKey: true
    },
    color: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    model: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Vehicle',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
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

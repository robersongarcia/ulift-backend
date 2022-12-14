const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Route.init(sequelize, DataTypes);
}

class Route extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    driverID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Driver',
        key: 'driverID'
      }
    },
    rNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'Route',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "driverID" },
          { name: "rNumber" },
        ]
      },
    ]
  });
  }
}

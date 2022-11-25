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
    }
  }, {
    sequelize,
    tableName: 'Route',
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

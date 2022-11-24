const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Driver.init(sequelize, DataTypes);
}

class Driver extends Sequelize.Model {
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
    status: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    availability: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Driver',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "driverID" },
        ]
      },
    ]
  });
  }
}

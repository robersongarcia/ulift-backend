const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Driver.init(sequelize, DataTypes);
}

class Driver extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    driverID: {
      autoIncrement: true,
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
      type: DataTypes.INTEGER,
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

const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Waiting_List.init(sequelize, DataTypes);
}

class Waiting_List extends Sequelize.Model {
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
        model: 'Driver',
        key: 'driverID'
      }
    }
  }, {
    sequelize,
    tableName: 'Waiting_List',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "passengerID" },
          { name: "driverID" },
        ]
      },
      {
        name: "driverID",
        using: "BTREE",
        fields: [
          { name: "driverID" },
        ]
      },
    ]
  });
  }
}

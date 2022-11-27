const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Destination.init(sequelize, DataTypes);
}

class Destination extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    DNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    lat: {
      type: DataTypes.DECIMAL(8,6),
      allowNull: true
    },
    lng: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Destination',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userID" },
          { name: "DNumber" },
        ]
      },
    ]
  });
  }
}

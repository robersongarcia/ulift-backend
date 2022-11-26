const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Favorites.init(sequelize, DataTypes);
}

class Favorites extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    userID1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    userID2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Favorites',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userID1" },
          { name: "userID2" },
        ]
      },
      {
        name: "userID2",
        using: "BTREE",
        fields: [
          { name: "userID2" },
        ]
      },
    ]
  });
  }
}

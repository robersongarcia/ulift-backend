const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Confirmation_Token.init(sequelize, DataTypes);
}

class Confirmation_Token extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    token: {
      type: DataTypes.STRING(120),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'Confirmation_Token',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
  }
}

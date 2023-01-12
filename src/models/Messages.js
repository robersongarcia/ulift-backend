const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Messages.init(sequelize, DataTypes);
}

class Messages extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    messageID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Messages',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "messageID" },
        ]
      },
    ]
  });
  }
}

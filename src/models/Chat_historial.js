const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Chat_historial.init(sequelize, DataTypes);
}

class Chat_historial extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    senderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    receiverID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    dateMessage: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    messageID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    statusMessage: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    room: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Chat_historial',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "senderID" },
          { name: "receiverID" },
          { name: "dateMessage" },
        ]
      },
      {
        name: "receiverID",
        using: "BTREE",
        fields: [
          { name: "receiverID" },
        ]
      },
    ]
  });
  }
}

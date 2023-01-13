const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Rating.init(sequelize, DataTypes);
}

class Rating extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    raterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    receiverID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    commentary: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    finished: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    liftID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'Rating',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "raterID" },
          { name: "receiverID" },
          { name: "liftID" },
        ]
      },
      {
        name: "Rating_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "receiverID" },
        ]
      },
    ]
  });
  }
}

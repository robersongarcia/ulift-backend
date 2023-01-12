const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Confirmation_Token.init(sequelize, DataTypes);
}

class Confirmation_Token extends Sequelize.Model{
    static init(sequelize, DataTypes) {
        return super.init({
            token: {
                type: DataTypes.STRING(255),
                allowNull: false,
                primaryKey: true
            }
        },{
            sequelize,
            tableName: 'Confirmation_Token',
            timestamps: false,
        })
    }
}
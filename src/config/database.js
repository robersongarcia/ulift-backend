const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bd2_202225_27922357', 'bd2_202225_27922357', '27922357', {
    host: 'labs-dbservices01.ucab.edu.ve',
    dialect: 'mariadb',
    port: 3306,
    dialectOptions: {
        connectTimeout: 60000
      },
    logging: (...msg) => console.log(msg)
  });

module.exports = sequelize;
module.exports.sequelize = sequelize;
module.exports.default = sequelize;


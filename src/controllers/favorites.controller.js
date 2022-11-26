const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const Favorite = require('../models/Favorites.js')(sequelize,DataTypes);

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll({ where: { userID1: req.user.id } });
      res.json({
        success: true,
        message: 'user favorites',
        favorites: favorites
      })
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavorites };
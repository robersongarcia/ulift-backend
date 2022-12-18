const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const Favorite = require('../models/Favorites.js')(sequelize,DataTypes);

const getFavorites = async (req, res, next) => {
  try {
    const [results, metadata] = await sequelize.query(
      `SELECT u.nameU, u.photo, u.rate, COUNT(l.liftID) AS n_trips
      FROM User u, Favorites f, Lift l
      WHERE (f.userID2 = u.id)
      AND (u.id = l.passengerID)
      AND (userID1 = ${req.user.id})`
    );
    res.json({
      success: true,
      message: 'user favorites',
      favorites: results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavorites };
const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const Favorite = require('../models/Favorites.js')(sequelize,DataTypes);
const User = require('../models/User.js')(sequelize,DataTypes);

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll({attributes: ['userID2'],
      where: { userID1: req.user.id }});
    
    const userF = [];
    for(var k in favorites){
      userF.push(favorites[k].userID2);
    }

    const users = await User.findAll({attributes: ['id', 'nameU', 'photo', 'rate'],
      where: { id: userF }});

    for (var k in users){
      const [results, metadata] = await sequelize.query(
        `SELECT COUNT(l.liftID) AS n_trips
        FROM User u, Lift l
        WHERE (u.id = l.passengerID)
        AND (l.passengerID = ${users[k].id})
        AND (l.complete = 1)`
      );
      users[k].dataValues.n_trips = results[0].n_trips;
    }
    res.json({
      success: true,
      message: 'user favorites',
      favorites: users
    });
  }catch (error)
    {message: "Something Wrong Happened" }
}

const postFavorite = async (req, res, next) => {
  try{
    const email = req.body.email;

    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if(user===null){
      res.status(400).json({
        success: false,
        message: 'user not found'
      });
      return;
    }

    if(user.id === req.user.id){
      res.status(400).json({
        success: false,
        message: 'user cannot be favorite of himself'
      });
      return;
    }

    const exist = await Favorite.findOne({
      where: {
        userID1: req.user.id,
        userID2: user.id
      }
    });

    if(exist!==null){
      res.status(400).json({
        success: false,
        message: 'favorite already exists'
      });
    }

    const favorite = await Favorite.create({
      userID1: req.user.id,
      userID2: user.id
    });

    res.json({
      success: true,
      message: 'favorite added'
    });

  } catch (error) {
    next(error);
  }

};

module.exports = { getFavorites, postFavorite };
const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const User = require('../models/User.js')(sequelize,DataTypes);
const Lift = require('../models/Lift.js')(sequelize,DataTypes);

const getProfile = async (req, res, next) => {
    try {
        // calculate the nums of lifts of the user
        const trips = await Lift.findAll(
            { attributes: [
                [sequelize.fn('COUNT', sequelize.col('liftID')), 'n_trips']
            ]}, 
            { where: 
                { passangerID: req.user.id }
            });

        req.user.dataValues.trips = trips[0].dataValues.n_trips;
        
        res.json({
            success: true,
            message: 'user profile information',
            user: req.user
        })

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile
};
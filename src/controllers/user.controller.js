const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const User = require('../models/User.js')(sequelize,DataTypes);
const Lift = require('../models/Lift.js')(sequelize,DataTypes);
const Vehicle = require('../models/Vehicle.js')(sequelize,DataTypes);
const Driver = require('../models/Driver.js')(sequelize,DataTypes);

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

const postVehicle = async (req, res, next) => {
    try {
        const {plate, model, color, seats} = req.body;

        const driver = await Driver.findOne({where: {driverID: req.user.id}});

        if (driver) {

            if(await Vehicle.findOne({where:{plate: plate}})){
                res.status(400).json({
                    success: false,
                    message: 'vehicle already exists'
                });

            }

            const vehicle = await Vehicle.create({
                plate,
                model,
                color,
                driverID: req.user.id,
                seats
            });
    
            res.json({
                success: true,
                message: 'vehicle created',
                vehicle
            })
        }else{
            res.status(400).json({
                success: false,
                message: 'you are not a driver'
            })
        }

    } catch (error) {
        next(error);
    }
};

const getVehicles = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.findAll({where: {driverID: req.user.id}});

        if(vehicles.length > 0){
            res.json({
                success: true,
                message: 'vehicles of the user',
                vehicles
            })
        }else{
            res.status(400).json({
                success: false,
                message: 'you have no vehicles'
            })
        }

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProfile,
    postVehicle,
    getVehicles
};
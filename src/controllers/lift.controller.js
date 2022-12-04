const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const User = require('../models/User.js')(sequelize,DataTypes);
const Lift = require('../models/Lift.js')(sequelize,DataTypes);
const Vehicle = require('../models/Vehicle.js')(sequelize,DataTypes);
const Driver = require('../models/Driver.js')(sequelize,DataTypes);
const Route = require('../models/Route.js')(sequelize,DataTypes);

const getMatch = async (req, res, next) => {
    try {

        const activeRoutes = 'working'
        
    } catch (error) {
        next(error);            
    }
}

const oldMatch = async (req, res, next) => {

    //lifts array
    const lifts = [];
    //drivers that can be matched
    const activeDrivers = await Driver.findAll({where: {status: 'A', availability: true}});

    for (const driverInfo of activeDrivers) {
        //get lift info
        const userInfo = await User.findOne({where: {id: driverInfo.driverID}});
        const liftInfo = await Lift.findOne({where: {driverID: driverInfo.driverID}});
        const vehicleInfo = await Vehicle.findOne({where: {plate: liftInfo.plate}});
        const routeInfo = await Route.findOne({where: {driverID: driverInfo.driverID, active: true}});        

        lifts.push({
            driver: {
                email: userInfo.email,
                name: userInfo.nameU,
                lastname: userInfo.lastname,
                photo: userInfo.photo,
                waitingTime: driverInfo.waitingTime,
                rate: userInfo.rate,
                date: liftInfo.dateL,
                time: liftInfo.timeL,
                vahicle: {
                    plate: vehicleInfo.plate,
                    model: vehicleInfo.model,
                    color: vehicleInfo.color,
                    seats: vehicleInfo.seats,
                }
            },
            route: routeInfo.path
        });
    }

    //matching algorithm
    const lat = req.params.lat;
    const lng = req.params.lng;

    console.log(lat);
    console.log(lng);

    res.json({
        success: true,
        message: 'active lifts',
        lifts
    });
}

module.exports = {
    getMatch
}
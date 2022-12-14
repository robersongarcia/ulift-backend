const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const User = require('../models/User.js')(sequelize,DataTypes);
const Lift = require('../models/Lift.js')(sequelize,DataTypes);
const Vehicle = require('../models/Vehicle.js')(sequelize,DataTypes);
const Driver = require('../models/Driver.js')(sequelize,DataTypes);
const Route = require('../models/Route.js')(sequelize,DataTypes);
const Destination = require('../models/Destination.js')(sequelize,DataTypes);

const getProfile = async (req, res, next) => {
    try {
        // calculate the nums of lifts of the user
        const trips = await Lift.findAll(
            { attributes: [
                [sequelize.fn('COUNT', sequelize.col('liftID')), 'n_trips']
            ],  where: 
                { passengerID: req.user.id }
            });

        if(trips.length > 0){
            req.user.dataValues.trips = trips[0].dataValues.n_trips;
        }else{
            req.user.dataValues.trips = 0;
        }
        
        const routes = await Route.findAll({
            where: {
                driverID: req.user.id
            }
        });
        
        if(routes.length > 0){
            req.user.dataValues.routes = routes;
        }else{
            req.user.dataValues.routes = [];
        }

        const vehicles = await Vehicle.findAll({
            where: {
                driverID: req.user.id
            }
        });

        if(vehicles.length > 0){
            req.user.dataValues.vehicles = vehicles;
        }else{
            req.user.dataValues.vehicles = [];
        }

        const destination = await Destination.findAll({
            where: {
                userID: req.user.id
            }
        }); 

        if(destination.length > 0){
            req.user.dataValues.destination = destination;
        }else{
            req.user.dataValues.destination = [];
        }
        
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
            const newDriver = await Driver.create({
                driverID: req.user.id,
                status: 'I',
                availability: 0
            });

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

const getRoutes = async (req, res, next) => {
    try {
        const routes = await Route.findAll({where: {driverID: req.user.id}});
        if(routes.length > 0){
            res.json({
                success: true,
                message: 'routes of the user',
                routes
            });
        }else{
            res.status(400).json({
                success: false,
                message: 'you have no routes'
            })
        }
        
    } catch (error) {
        next(error);
    }
}

const postRoute = async (req, res, next) => {
    try {
        const {path,name} = req.body;
        const driver = await Driver.findOne({where: {driverID: req.user.id}});
        if(driver){
            const route = await Route.build({
                path: JSON.stringify(path),
                name,
                driverID: req.user.id,
                rNumber: (await Route.count({where: {driverID: req.user.id}}) + 1)
            });

            if(route.rNumber == 1){
                console.log(route);
                route.dataValues.active = 1;
            }

            await route.save();            

            res.status(200).json({
                success: true,
                message: 'route created'
            })

        }else{
            res.status(400).json({
                success: false,
                message: 'you have no vehicles, you are not a driver'
            })
        }
    } catch (error) {
        next(error);
    }
};

const getDestination = async (req, res, next) => {
    try {
        const destination = await Destination.findAll({where: {userID: req.user.id}});
        if(destination.length > 0){
            res.json({
                success: true,
                message: 'destination of the user',
                destination
            });
        }else{
            res.status(400).json({
                success: false,
                message: 'you have no destination'
            })
        };
    } catch (error) {
        next(error);
    }
};

const postDestination = async (req, res, next) => {
    try {
        const {lat, lng} = req.body;
        const destination = await Destination.build({
            lat: (parseFloat(lat)),
            lng: (parseFloat(lng)),
            userID: req.user.id,
            dNumber: (await Destination.count({where: {userID: req.user.id}}) + 1)
        });

        await destination.save();

        res.status(200).json({
            success: true,
            message: 'destination created'
        })

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProfile,
    postVehicle,
    getVehicles,
    getRoutes,
    postRoute,
    getDestination,
    postDestination
};
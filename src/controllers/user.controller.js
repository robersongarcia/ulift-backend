const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const { request } = require('express');
const Waiting_List = require('../models/Waiting_List.js');
const User = require('../models/User.js')(sequelize,DataTypes);
const Lift = require('../models/Lift.js')(sequelize,DataTypes);
const Vehicle = require('../models/Vehicle.js')(sequelize,DataTypes);
const Driver = require('../models/Driver.js')(sequelize,DataTypes);
const Route = require('../models/Route.js')(sequelize,DataTypes);
const Destination = require('../models/Destination.js')(sequelize,DataTypes);
const WaitingList = require('../models/Waiting_List.js')(sequelize,DataTypes);
const Rating = require('../models/Rating.js')(sequelize,DataTypes);

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
                driver.availability = 1;
                await driver.save();
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
        const {lat, lng, name} = req.body;
        const destination =  Destination.build({
            lat: (parseFloat(lat)),
            lng: (parseFloat(lng)),
            userID: req.user.id,
            dNumber: (await Destination.count({where: {userID: req.user.id}}) + 1),
            name: name
        });

        console.log(destination);

        await destination.save();

        res.status(200).json({
            success: true,
            message: 'destination created'
        })

    } catch (error) {
        next(error);
    }
}

const getStatus = async (req, res, next) => {
    try {
        const driver = await Driver.findOne({where: {driverID: req.user.id}});
        if(driver===null){
            res.json({
                success: true,
                message: 'you are not a driver',
                status: 'P'
            });
            return;
        }

        if(driver.status === 'I'){
            res.json({
                success: true,
                message: 'driver is inactive',
                status: 'P'
            });
            return;
        }

        if(driver.status === 'A' || driver.status === 'P'){
            res.json({
                success: true,
                message: 'driver is active',
                status: 'D'
            });
            return;
        }

        res.json({
            success: true,
            message: 'you are a passanger',
            status: 'P'});


    } catch (error) {
        next(error);
    };    
};

const getMode = async (req, res, next) => {
    try {

        /*
            modos
            E <- conductor con cola activa en espera de solicitudes
            P <- conductor con cola en proceso, la parte de los checks
            L <- pasajero aceptado en una cola
            R <- pasajero esta haciendo una peticion de cola
            F <- no esta en ninguna actividad
            N <- necesita hacer el rating de un viaje
        */
        
        const driver = await Driver.findOne({where: {driverID: req.user.id}});
        if(driver!==null){
            if(driver.status == 'A'){
                res.json({
                    success: true,
                    message: 'driver is active',
                    mode: 'E'
                });
                return;
            }

            if(driver.status == 'P'){
                res.json({
                    success: true,
                    message: 'driver is in process',
                    mode: 'P'
                });
                return;
            }
        }

        const lift = await Lift.findOne({
            where: {
                passengerID: req.user.id,
                complete: false
            }
        });

        if(lift !== null){
            res.json({
                success: true,
                message: 'passenger is in a lift',
                mode: 'L'
            });
            return;
        }

        const request = await WaitingList.findOne({
            where: {
                passengerID: req.user.id,
            }
        });

        if(request !== null){
            res.json({
                success: true,
                message: 'passenger is in a request',
                mode: 'R'
            });
            return;
        }

        const rating = await Rating.findOne({
            where: {
                raterID: req.user.id,
                finished: false
            }
        });

        if(rating !== null){
            res.json({
                success: true,
                message: 'passenger needs to rate a lift',
                mode: 'N'
            });
            return;
        };
        

        res.json({
            success: true,
            message: 'its free',
            mode: 'F'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    postVehicle,
    getVehicles,
    getRoutes,
    postRoute,
    getDestination,
    postDestination,
    getStatus,
    getMode
};
const sequelize = require('../config/database.js');
const { DataTypes, QueryTypes } = require('sequelize');
const User = require('../models/User.js')(sequelize,DataTypes);
const Lift = require('../models/Lift.js')(sequelize,DataTypes);
const Vehicle = require('../models/Vehicle.js')(sequelize,DataTypes);
const Driver = require('../models/Driver.js')(sequelize,DataTypes);
const Route = require('../models/Route.js')(sequelize,DataTypes);
const WaitingList = require('../models/Waiting_List.js')(sequelize,DataTypes);

const {getDistance} = require('../helpers/utils');

const getMatch = async (req, res, next) => {
    try {
    const lat = req.params.lat;
    const lng = req.params.lng;
    const destination = {lat,lng};

    const activeRoutes = await sequelize.query('SELECT l.liftID as liftID, u.email as email, u.nameU as name, u.lastname as lastname, u.photo as photo,d.waitingTime as waitingTime, u.rate as rate, l.dateL as date, l.timeL as time, v.plate as plate, v.model as model,v.color as color, v.seats as seats, r.path as path FROM User u, Driver d, Route r,Lift l, Vehicle v WHERE u.id = d.driverID AND d.status = \'A\' AND d.availability = true AND r.driverID = d.driverID AND r.active = true AND l.driverID = d.driverID AND l.liftID = (SELECT liftID FROM Lift ll WHERE ll.driverID = d.driverID ORDER BY liftID DESC LIMIT 1) AND l.plate = v.plate',{
        type: QueryTypes.SELECT
    });

    let optRoutes = [];

    if(req.body.maxDistance){
        for(let i = 0 ; i < activeRoutes.length; i++){
            for(let j = 0; j < activeRoutes[i].path.length; j++){
                const distance = getDistance(activeRoutes[i].path[j],destination);
                if(distance <= req.body.maxDistance){
                    activeRoutes[i].distanceLastNode = getDistance(activeRoutes[i].path[activeRoutes[i].path.length-1],destination);
                    optRoutes.push(activeRoutes[i]);
                    break;
                }
            }
        }

        optRoutes.sort((a,b) => a.distanceLastNode - b.distanceLastNode);

        if(optRoutes.length > 0){
            res.json({
                success: true,
                message: 'optimal routes',
                lifts: optRoutes
            });
        }else{
            res.json({
                success: true,
                message: 'no active lifts',
                lifts: []
            });
        }

    }else{
        for(let i = 0; i < activeRoutes.length; i++){
            activeRoutes[i].distanceLastNode = getDistance(activeRoutes[i].path[activeRoutes[i].path.length-1],destination);
        }
        
        activeRoutes.sort((a,b) => a.distanceLastNode - b.distanceLastNode);

        if(activeRoutes.length > 0){
            res.json({
                success: true,
                message: 'active lifts',
                lifts: activeRoutes
            });
        }else{
            res.json({
                success: true,
                message: 'no active lifts',
                lifts: []
            });
        }
    }      
    } catch (error) {
        next(error);            
    }
};

const createLift = async (req, res, next) => {
    try {
        const driver = await Driver.findOne({
            where: {
                driverID: req.user.id
            }
        });

        if(driver === null){
            res.status(400).json({
                success: false,
                message: 'driver not found'
            });
            return;
        }

        if(driver.availability == false){
            res.status(400).json({
                success: false,
                message: 'driver not available'
            });
            return;
        }

        if(driver.status == 'A'){
            res.status(400).json({
                success: false,
                message: 'driver have an active lift'
            });
            return;
        }

        const vehicle = await Vehicle.findOne({
            where: {
                plate: req.body.plate,
                driverID: req.user.id
            }
        });
        
        if(vehicle === null){
            res.status(400).json({
                success: false,
                message: 'vehicle not found'
            });
            return;
        }

        const route = await Route.findOne({
            where: {
                driverID: req.user.id,
                rNumber: req.body.rNumber
            }
        });

        if(route === null){
            res.status(400).json({
                success: false,
                message: 'route not found'
            });
            return;
        }

        if(route.active == false){
            route.active = true;
            await route.save();
        }

        const lift = await Lift.create({
            driverID: req.user.id,
            plate: req.body.plate,
            seats: req.body.seats,
            passengerID: req.user.id,
            rdNumber: route.rNumber,
            liftID: ((await Lift.max('liftID')) + 1),
        });
        
        driver.status = 'A';
        driver.waitingTime = req.body.waitingTime;
        await driver.save();

        res.json({
            success: true,
            message: 'lift created',
            lift: lift
        });
    }
    catch (error) {
        next(error);
    };
};

const getLiftRequests = async (req, res, next) => {
    try {
        const waiting = await WaitingList.findAll({
            where: {
                driverID: req.user.id
            }
        });
        
        if(waiting.length > 0){
            
            const usersRequests = await User.findAll(
                {attributes: ['email','nameU','lastname','photo','rate','gender','role']},{
                    where: {
                        id: waiting.map((w) => w.passengerID)
                    }                        
                }
            );

            res.json({
                success: true,
                message: 'lift requests',
                requests: usersRequests
            });
        }else{
            res.json({
                success: true,
                message: 'no lift requests',
                requests: []
            });
        }

    } catch (error) {
        next(error);
    };
};

const liftHistory = async (req, res, next) =>{
    res.json({
        liftsConductor: [await sequelize.query('SELECT l.liftID as liftID, u.email as email, u.nameU as name, u.lastname as lastname, u.photo as photo, r.name as routename, d.waitingTime as waitingTime, u.rate as rate, l.dateL as date, l.timeL as time, v.plate as plate, v.model as model,v.color as color, v.seats as seats, r.path as path FROM User u, Driver d, Route r,Lift l, Vehicle v WHERE l.driverID = ' + req.user.id +' AND l.driverID = l.passengerID AND u.id = d.driverID AND d.status = \'A\' AND d.availability = true AND r.driverID = d.driverID AND r.active = true AND l.driverID = d.driverID AND l.liftID = (SELECT liftID FROM Lift ll WHERE ll.driverID = d.driverID ORDER BY liftID DESC LIMIT 1) AND l.plate = v.plate',{
    type: QueryTypes.SELECT
    })],
        liftsPasajero: [await sequelize.query('SELECT l.liftID as liftID, u.email as email, u.nameU as name, u.lastname as lastname, u.photo as photo, r.name as routename, d.waitingTime as waitingTime, u.rate as rate, l.dateL as date, l.timeL as time, v.plate as plate, v.model as model,v.color as color, v.seats as seats, r.path as path FROM User u, Driver d, Route r,Lift l, Vehicle v WHERE l.passengerID = ' + req.user.id +' AND l.driverID != l.passengerID AND u.id = d.driverID AND d.status = \'A\' AND d.availability = true AND r.driverID = d.driverID AND r.active = true AND l.driverID = d.driverID AND l.liftID = (SELECT liftID FROM Lift ll WHERE ll.driverID = d.driverID ORDER BY liftID DESC LIMIT 1) AND l.plate = v.plate',{
    type: QueryTypes.SELECT
        })]
});
}

module.exports = {
    getMatch,
    createLift,
    liftHistory
}
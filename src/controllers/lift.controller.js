const sequelize = require('../config/database.js');
const { DataTypes, QueryTypes } = require('sequelize');
const User = require('../models/User.js')(sequelize,DataTypes);
const Lift = require('../models/Lift.js')(sequelize,DataTypes);
const Vehicle = require('../models/Vehicle.js')(sequelize,DataTypes);
const Driver = require('../models/Driver.js')(sequelize,DataTypes);
const Route = require('../models/Route.js')(sequelize,DataTypes);
const WaitingList = require('../models/Waiting_List.js')(sequelize,DataTypes);
const Rating = require('../models/Rating.js')(sequelize,DataTypes);

const {getDistance} = require('../helpers/utils');
const { body } = require('express-validator');
const { get } = require('../routes/favorites.routes.js');

const getMatch = async (req, res, next) => {
    try {
    const lat = req.params.lat;
    const lng = req.params.lng;
    const destination = {lat,lng};
    const wOnly = parseInt(req.params.wOnly);
    let maxD = 0;
    if(typeof req.params.maxD ==! 'undefined'){
        maxD = parseFloat(req.params.maxD);
    }

    let activeRoutes = await sequelize.query('SELECT l.liftID as liftID, l.driverID as driverID ,u.email as email, u.nameU as name, u.lastname as lastname, u.photo as photo,d.waitingTime as waitingTime, u.gender as gender, u.rate as rate, l.dateL as date, l.timeL as time, v.plate as plate, v.model as model,v.color as color, v.seats as seats, r.path as path, u.role as role, r.name as rName FROM User u, Driver d, Route r,Lift l, Vehicle v WHERE u.id = d.driverID AND l.passengerID = l.driverID AND d.status = \'A\' AND d.availability = true AND r.driverID = d.driverID AND r.active = true AND l.driverID = d.driverID AND l.complete = 0 AND l.liftID = (SELECT liftID FROM Lift ll WHERE ll.driverID = d.driverID ORDER BY liftID DESC LIMIT 1) AND l.plate = v.plate',{
        type: QueryTypes.SELECT
    });

    if(wOnly){
        activeRoutes = activeRoutes.filter(route => route.gender === 'F');
    }

    if(!lat && !lng){
        res.json({
            success: true,
            message: 'all lifts',
            lifts: activeRoutes
        });
        return;
    }

    let optRoutes = [];

    if(maxD){
        for(let i = 0 ; i < activeRoutes.length; i++){
            for(let j = 0; j < activeRoutes[i].path.length; j++){                
                const distance = getDistance(activeRoutes[i].path[j],destination);
                if(distance <= maxD){                    
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

        console.log(route);

        if(route.active == 0){
            await sequelize.query('UPDATE Route SET active = 0 WHERE driverID = :driverID',{
                replacements: {
                    driverID: req.user.id
                    }
                    });

            await sequelize.query('UPDATE Route SET active = 1 WHERE driverID = :driverID AND rNumber = :rNumber',{
                replacements: {
                    driverID: req.user.id,
                    rNumber: req.body.rNumber
                }
            });
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
                {
                    where: {
                        id: waiting.map((w) => {
                            if(w.driverID == req.user.id){
                                return w.passengerID;
                            }
                                return;
                        })
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

const acceptLiftRequest = async (req, res, next) => {
    try {
        const passenger = await User.findOne({
            where: {
                id: req.body.id
            }
        });

        if(passenger === null){
            res.status(400).json({
                success: false,
                message: 'passenger not found'
            });
            return;
        }


        const lift = await Lift.findOne({
            where: {
                driverID: req.user.id,
                passengerID: req.user.id,
                complete: false
            }
        });

        if(lift === null){
            res.status(400).json({
                success: false,
                message: 'lift not found'
            });
        }

        const passangerLift = await Lift.findOne({
            where: {
                passengerID: passenger.id,
                complete:false
            }
        });

        if(passangerLift !== null){
            res.status(400).json({
                success: false,
                message: 'passenger have an active lift'
            });
            return;
        }

        //query for get seats available of the lift
        const seatsAvailable = await sequelize.query('SELECT (seats-(SELECT COUNT(liftID) FROM Lift WHERE driverID = :driver AND passengerID != :driver AND complete = false)) as seats FROM Lift WHERE driverID = :driver AND passengerID = :driver AND complete = false;',{
            replacements: {driver: req.user.id},
            type: QueryTypes.SELECT
        })
        
        if(seatsAvailable[0].seats <= 0){
            res.status(400).json({
                success: false,
                message: 'no seats available'
            });
            return;
        }

        const newLift = await Lift.create({
            driverID: req.user.id,
            plate: lift.plate,
            seats: seatsAvailable[0].seats-1,
            passengerID: req.body.id,
            rdNumber: req.body.dNumber,
            liftID: lift.liftID,
        });

        res.json({
            success: true,
            message: 'passanger accepted',
            lift: newLift
        }
        );                 

    }catch (error) {
        next(error);
    }
};

const postRequestLift = async (req, res, next) => {
    try {

        //gets liftID
        const lift = await Lift.findOne({
            where: {
                LiftID: req.body.liftID
            }
        });

        if(lift === null){
            res.status(400).json({
                success: false,
                message: 'lift not found'
            });
            return;
        }

        console.log(lift);

        const wait = await WaitingList.findOne({
            where: {
                passengerID: req.user.id,
            }
        });

        if(wait !== null){
            res.status(400).json({
                success: false,
                message: 'passenger already in waiting list'
            });
            return;
        }

        const request = await WaitingList.create({
            passengerID: req.user.id,
            driverID: lift.driverID
        });

        if(request === null){
            res.status(400).json({
                success: false,
                message: 'request not created'
            });
            return;
        }

        res.json({
            success: true,
            message: 'request sent'
        });


    } catch (error) {
        next(error);
    }
};

const cancelLift = async (req, res, next) => {
    try {
        const lifts = await Lift.findAll({
            where: {
                LiftID: req.body.liftID,
                driverID: req.user.id,
                complete: false
            }
        });
        
        if(lifts === null){
            res.status(400).json({
                success: false,
                message: 'lifts not found'
            });
            return;
        }

        //delete all lifts
         lifts.forEach(async (lift) => {
            await lift.destroy();
        });

        //get driver of the lift
        const driver = await Driver.findOne({        
            where: {
                driverID: req.user.id
            }
        });

        //change driver status to I
        driver.status = 'I';
        await driver.save();

        res.json({
            success: true,
            message: 'lifts canceled'
        });
        

    } catch (error) {
        next(error);
    }
};

const cancelRequest = async (req , res ,next) => {
    try {
        
        const request = WaitingList.findOne({
            where: {
                passengerID: req.user.id
            }
        });
        
        if(request === null){
            res.status(400).json({
                success: false,
                message: 'request not found'
            });
            return;
        }

        await request.destroy();

        res.json({
            success: true,
            message: 'request canceled'
        });

    } catch (error) {
        next(error);
    }
}

const getPassengers = async (req, res, next) => {
    try {
        //get lift by id on params
        const {liftID} = req.params;

        const lift = await Lift.findAll({
            where: {
                liftID: liftID
            }
        });

        if(lift === null){
            res.status(400).json({
                success: false,
                message: 'lift not found'
            });
            return;
        }

        //get passengers of the lift
        const passengers = await User.findAll({
            where: {
                id: lift.map((l) => {
                    if(l.passengerID === l.driverID){
                        return ;
                    }
                    return l.passengerID;
                })
            }
        });

        if(passengers === null){
            res.status(400).json({
                success: false,
                message: 'passengers not found'
            });
            return;
        }

        res.json({
            success: true,
            message: 'passengers',
            passengers: passengers
        });


    } catch (error) {
        next(error);
    }
};

const liftCompleteCheck = async (req, res, next) => {
    try {

        const lift = await Lift.findOne({
            where: {
                passengerID: req.user.id,
                complete: false
            }
        });


        if(lift === null){
            res.status(400).json({
                success: false,
                message:'no lift'
            });
            return;
        }

        lift.complete = true;
        await lift.save();

        if(lift.driverID == lift.passengerID){
            const driver = await Driver.findOne({
                where: {
                    driverID: lift.driverID
                }
            });
            driver.status = 'I';
            await driver.save();
        }

        res.json({
            success: true,
            message: 'lift complete'
        });

    } catch (error) {
        next(error);
    }  
};

const driverCheck = async (req, res, next) => {
    try {
        const {passengerID} = req.params;
        
        const lift = await Lift.findOne({
            where: {
                driverID: req.user.id,
                complete: false,
                passengerID: req.user.id
            }
        });

        if(lift === null){
            res.status(400).json({
                success: false,
                message: 'no lift'
            });
            return;
        }

        const passLift = await Lift.findOne({
            where: {
                passengerID: passengerID,
                liftID: lift.liftID,
            }
        });

        passLift.driverCheck = true;
        await passLift.save();

        res.json({
            success: true,
            message: 'passengerChecked'
        });


    } catch (error) {
        next(error);
    }
};

const startLift = async (req, res, next) => {
    try {

        const driver = await Driver.findOne({
            where:{
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

        const lift = await Lift.findOne({
            where: {
                driverID: req.user.id,
                complete: false
            }
        });

        if(lift === null){
            res.status(400).json({
                success: false,
                message: 'lift not found'
            });
            return;
        }

        driver.status = 'P';

        await driver.save();
                
        //create rating tuples

        res.json({
            success: true,
            message: 'lift started'
        });

    } catch (error) {
        next(error);
    }
};
    
const liftHistory = async (req, res, next) =>{
    res.json({
        liftsConductor: [await sequelize.query('SELECT l.liftID as liftID, u.email as email, u.nameU as name, u.lastname as lastname, u.photo as photo, r.name as routename, d.waitingTime as waitingTime, u.rate as rate, l.dateL as date, l.timeL as time, v.plate as plate, v.model as model,v.color as color, v.seats as seats, r.path as path FROM User u, Driver d, Route r,Lift l, Vehicle v WHERE l.driverID = ' + req.user.id + ' AND l.driverID = l.passengerID AND d.driverID = l.driverID AND u.id = d.driverID AND r.driverID = d.driverID AND r.rNumber = l.rdNumber AND l.complete = 1 AND l.plate = v.plate',{
    type: QueryTypes.SELECT
    })],
        liftsPasajero: [await sequelize.query('SELECT l.liftID as liftID, u.email as email, u.nameU as name, u.lastname as lastname, u.photo as photo, r.name as routename, d.waitingTime as waitingTime, u.rate as rate, l.dateL as date, l.timeL as time, v.plate as plate, v.model as model,v.color as color, v.seats as seats, r.path as path FROM User u, Driver d, Route r,Lift l, Vehicle v WHERE l.passengerID = ' + req.user.id + ' AND l.driverID != l.passengerID AND d.driverID = l.driverID AND u.id = d.driverID AND r.driverID = d.driverID AND r.rNumber = l.rdNumber AND l.complete = 1 AND l.plate = v.plate',{
    type: QueryTypes.SELECT
        })]
});
}

const driverInfo = async (req, res, next) => {
    try {

        const lift = await Lift.findOne({
            where: {
                complete: false,
                passengerID: req.user.id
            }
        });

        if(lift === null){
            res.status(400).json({
                success: false,
                message: 'no lift'
            });
            return;
        }

        const driver = await Driver.findOne({
            where: {
                driverID: lift.driverID
            }
        });

        if(driver === null){
            res.status(400).json({
                success: false,
                message: 'no driver'
            });
            return;
        }
        
        const user = await User.findOne({
            where: {
                id: driver.driverID
            }
        });

        if(user === null){
            res.status(400).json({
                success: false,
                message: 'no user'
            });
            return;
        }

        const vehicle = await Vehicle.findOne({
            where: {
                plate: lift.plate
            }
        });

        if(vehicle === null){
            res.status(400).json({
                success: false,
                message: 'no vehicle'
            });
            return;
        }

        res.json({
            success: true,
            driver: {
                name: user.nameU,
                lastname: user.lastname,
                email: user.email,
                photo: user.photo,
                rate: user.rate,
                photo: user.photo,
                id: user.id,
                emergencyContact: user.emergencyContact,
                emergencyPhone: user.emergencyPhone,
                vehicle: {
                    plate: vehicle.plate,
                    model: vehicle.model,
                    color: vehicle.color,
                    seats: vehicle.seats
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

const createRatings = async (liftID, driverID) => {
    //create rating objects
    const allLifts = await Lift.findAll({
        where: {
            liftID: liftID
        }
    });

    if(allLifts === null){
        res.status(400).json({
            success: false,
            message: 'lift not found'
        });
        return;
    }

    //get passengers of the lift
    const passengers = await User.findAll({
        where: {
            id: allLifts.map((l) => {
                if(l.passengerID === l.driverID){
                    return ;
                }
                return l.passengerID;
            })
        }
    });

    if(passengers === null){
        res.status(400).json({
            success: false,
            message: 'passengers not found'
        });
        return;
    }

    passengers.forEach(async (p) => {
        console.log('aquixd');
        const rating = await Rating.create({
            liftID: liftID,
            raterID: p.id,
            receiverID: driverID,
            finished:false
        });
    });

    passengers.forEach(async (p) => {
        console.log('aqui');
        const rating = await Rating.create({
            liftID: liftID,
            raterID: driverID,
            receiverID: p.id,
            finished:false
        });
    });

    return;

}

const createRatingTest = async (req, res, next) => {
    try {
        const liftID = req.body.liftID;
        const driverID = req.body.driverID;

        await createRatings(liftID, driverID);

        res.json({
            success: true,
            message: 'ratings created'
        });

    } catch (error) {
        next(error);
    }
};

const getRating = async (req, res, next) => {
    try {
        //get rating from user.id

        const rating = await Rating.findAll({
            where: {
                raterID: req.user.id,
                finished: false
            }
        });

        if(rating === null){
            res.status(400).json({
                success: false,
                message: 'you have no ratings to do'
            });
            return;
        }

        res.json({
            success: true,
            rating: rating
        })

    } catch (error) {
        next(error);
    }
};

const postRating = async (req, res, next) => {
    try {
        const rating = await Rating.findOne({
            where: {
                raterID: req.user.id,
                receiverID: req.body.receiverID,
                finished: false
            }
        });

        if(rating === null){
            res.status(400).json({
                success: false,
                message: 'rating not found'
            });
            return;
        }

        rating.rate = req.body.rate;
        rating.finished = true;

        await rating.save();

        res.json({
            success: true,
            message: 'rating saved'
        });

    } catch (error) {
        next(error);
    }
};





module.exports = {
    getMatch,
    createLift,
    getLiftRequests,
    acceptLiftRequest,
    postRequestLift,
    cancelLift,
    cancelRequest,
    getPassengers,
    liftCompleteCheck,
    driverCheck,
    startLift,
    liftHistory,
    driverInfo,
    createRatingTest,
    getRating,
    postRating
}
    


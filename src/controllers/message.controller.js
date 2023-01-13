const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const Messages = require('../models/Messages.js')(sequelize,DataTypes);


const getAllMessages = async (req, res, next) => {
    try {
        const messages = await Messages.findAll();        

        if (messages === null){
            res.status(400).json({
                success: false,
                message: 'no messages'
            });
            console.log("no message");
        } 
        

    } catch (error) {
        next(error);
    }
};


const getMessage = async (req, res, next) => {
    try {
        const id = req.body.messageID;

        const message = await Messages.findOne({
            where: {
                messageID: id
            }
        });
        
        if(message===null){
            res.json({
                success: true,
                message: 'this message no exist',
                status: 'P'
            });
        }

        console.log(message);

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllMessages,
    getMessage
};
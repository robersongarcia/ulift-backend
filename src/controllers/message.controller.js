const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const { request } = require('express');
const Messages = require('../models/Messages.js')(sequelize,DataTypes);


const getMessages = async (req, res, next) => {
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


const postMessage = async (req, res, next) => {
    try {
        const id = req.body.messageID;
        console.log(req.body);

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
    getMessages,
    postMessage
};
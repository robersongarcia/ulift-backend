const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const { request } = require('express');
const Messages = require('../models/Messages.js')(sequelize,DataTypes);


const getMessages = async (req, res, next) => {
    try {
        const messages = await Messages.findAll({
            where: {
                messageID: messageID
            }
        });

        if (messages === null){
            res.status(400).json({
                success: false,
                message: 'no messages'
            });
            console.log("no message");
        } 
        
        console.log(messages);

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getMessages
};
const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const Chat = require('../models/Chat_historial.js')(sequelize,DataTypes);

const getSender = async (req, res, next) => {
    try {
        const room = req.body.room;
        const user = req.body.user;

        const messages = await Chat.findAll({
            where: {
                room : room,
                statusMessage : true,
                senderID : user
            }
        });        

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

const getReceiver = async (req, res, next) => {
    try {
        const room = req.body.room;
        const user = req.body.user;

        const messages = await Chat.findAll({
            where: {
                room : room,
                statusMessage : true,
                receiverID : user
            }
        });        

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


const getChat = async (req, res, next) => {
    try {
        const room = req.body.room;
        const messages = await Chat.findAll({
            where: {
                room : room,
                statusMessage : true
            }
        });        

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


const sendMessage = async (req, res, next) => {
    try {
        const message = await Chat.create({
            senderID: req.body.senderID,
            receiverID: req.body.receiverID,
            dateMessage: req.body.dateMessage,
            messageID: req.body.messageID,
            statusMessage: req.body.statusMessage,
            room : req.body.room
        });
        

        res.json({
            success: true,
            message: 'send',
            message: message
        });
    }
    catch (error) {
        next(error);
    };
}


module.exports = {
    getSender,
    getReceiver,
    getChat,
    sendMessage
};
import * as chat from '../controllers/chat.controller'
import express = require('express');

const chatRouter: express.Router = express.Router();

//post
chatRouter.post("/sendMessage/:communityID/:chatID",chat.sendMessage);
//put
chatRouter.put("/updateMessage/:communityID/:chatID/:messageID",chat.updateMessage);
//delete
chatRouter.delete("/deleteMessage/:communityID/:chatID/:messageID",chat.deleteMessage);
//get
chatRouter.get("/getChatByID/:ID",chat.getChatByID);
chatRouter.get("/getMembers/:ID",chat.getMembers);
chatRouter.get("/findChat/:ID/:name",chat.findChat);
chatRouter.get("/userChats/:ID",chat.userChats);



export default chatRouter;

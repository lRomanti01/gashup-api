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
chatRouter.get("/getMessages/:communityID/:chatID",chat.getMessages);
chatRouter.get("/findChat/:ID/:name",chat.findChat);


export default chatRouter;

import * as community from '../controllers/community.controller'
import express = require('express');

const communityRouter: express.Router = express.Router();

//post
communityRouter.post('/createChatCommunity/:id', community.createChatCommunity)
communityRouter.post("/createCommunity", community.createCommunity);

///delete
communityRouter.delete("/deleteCommunity/:id", community.deleteCommunity);
communityRouter.delete("/banFromCommunity/:id", community.banFromCommunity);
communityRouter.delete("/leaveChatCommunity/:id", community.leaveChatCommunity);

//put
communityRouter.put('/updateCommunity/:id', community.updateCommunity)

//get
communityRouter.get("/assignAdmins/:id", community.assignAdmins);
communityRouter.get('/getcommunities/', community.getcommunities)
communityRouter.get("/getcommunitiesForCategories", community.getcommunitiesForCategories);
communityRouter.get('/joinChatCommunity/:id', community.joinChatCommunity)
communityRouter.get("/joinCommunity/:id", community.joinCommunity);



export default communityRouter;
import * as community from '../controllers/community.controller'
import express = require('express');

const communityRouter: express.Router = express.Router();

//post
communityRouter.post('/createChatCommunity', community.createChatCommunity)
communityRouter.post("/createCommunity", community.createCommunity);

///delete
communityRouter.delete("/deleteCommunity/:communityName", community.deleteCommunity);
communityRouter.delete("/banFromCommunity/:communityName", community.banFromCommunity);
communityRouter.delete("/leaveChatCommunity/:communityName", community.leaveChatCommunity);

//put
communityRouter.put("/updateCommunity/:_id", community.updateCommunity);
communityRouter.put("/assignAdmins/:communityName", community.assignAdmins);


//get
communityRouter.get('/getcommunities/', community.getcommunities)
communityRouter.get("/getcommunitiesForCategories", community.getcommunitiesForCategories);
communityRouter.get('/joinChatCommunity/:communityName', community.joinChatCommunity)
communityRouter.get("/joinCommunity/:communityName", community.joinCommunity);



export default communityRouter;
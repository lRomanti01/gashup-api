import * as community from '../controllers/community.controller'
import express from "express";

const communityRouter: express.Router = express.Router();

//post
communityRouter.post('/createChatCommunity/:_id', community.createChatCommunity)
communityRouter.post("/createCommunity", community.createCommunity);
communityRouter.post('/joinChatCommunity/:_id', community.joinChatCommunity)
communityRouter.post("/joinCommunity/:_id", community.joinCommunity);

//put
<<<<<<< Updated upstream
communityRouter.put('/updateCommunity/:communityName', community.updateCommunity)
communityRouter.put("/assignAdmins/:communityName", community.assignAdmins);
=======
communityRouter.put("/updateCommunity/:_id", community.updateCommunity);
communityRouter.put("/assignAdmins/:_id", community.assignAdmins);
communityRouter.put("/updateCommunityChat/:_id", community.updateCommunityChat);
>>>>>>> Stashed changes

///delete
communityRouter.delete("/deleteCommunity/:_id", community.deleteCommunity);
communityRouter.delete("/banFromCommunity/:_id", community.banFromCommunity);
communityRouter.delete("/leaveChatCommunity/:_id", community.leaveChatCommunity);
communityRouter.delete("/deleteCommunityChat/:_id", community.deleteCommunityChat);

//get
communityRouter.get('/getCommunities/', community.getCommunities)
communityRouter.get("/getCommunitiesForCategories", community.getCommunitiesForCategories);
communityRouter.get("/getCommunityChats/:_id", community.getCommunityChats);

export default communityRouter;
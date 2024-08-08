import * as community from "../controllers/community.controller";
import express from "express";
import { upload } from "../multer";

const communityRouter: express.Router = express.Router();

//post
communityRouter.post("/createChatCommunity",upload,community.createChatCommunity);
communityRouter.post("/createCommunity", upload, community.createCommunity);
communityRouter.post("/joinChatCommunity/:_id", community.joinChatCommunity);
communityRouter.post("/joinCommunity/:_id", community.joinCommunity);
communityRouter.post("/createCategory", upload, community.createCategory);

//put
communityRouter.put("/updateCommunity/:_id", upload, community.updateCommunity);
communityRouter.put("/assignAdmins/:_id", community.assignAdmins);
communityRouter.put("/updateCommunityChat/:_id",upload,community.updateCommunityChat);
communityRouter.put("/leaveCommunity/:_id", community.leaveCommunity);
communityRouter.put("/leaveChatCommunity/:_id",community.leaveChatCommunity);
communityRouter.put("/deleteCommunity/:_id", community.deleteCommunity);

///delete
communityRouter.delete("/deleteCommunityChat/:_id",community.deleteCommunityChat);

//get
communityRouter.get("/getCommunities", community.getCommunities);
communityRouter.get("/getCommunity/:_id", community.getCommunity);
communityRouter.get("/getCommunitiesForCategories",community.getCommunitiesForCategories);
communityRouter.get("/hotCommunity", community.hotCommunity);// documentar
communityRouter.get("/getCategories", community.getCategories);// documentar;
communityRouter.get("/findCommunity/:ID", community.findCommunity);// documentar;
communityRouter.get("/findCommunityChats/:communityId/:userId", community.findCommunityChats);// documentar;



export default communityRouter;

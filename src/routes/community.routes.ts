import * as community from "../controllers/community.controller";
import express from "express";
import { upload } from "../multer";

const communityRouter: express.Router = express.Router();

//post
communityRouter.post("/createChatCommunity",upload,community.createChatCommunity);
communityRouter.post("/createCommunity", upload, community.createCommunity);
communityRouter.post("/joinChatCommunity/:_id", community.joinChatCommunity);
communityRouter.post("/joinCommunity/:_id", community.joinCommunity);
communityRouter.post("/leaveCommunity/:_id", community.leaveCommunity);

//put
communityRouter.put("/updateCommunity/:_id", upload, community.updateCommunity);
communityRouter.put("/assignAdmins/:_id", community.assignAdmins);
communityRouter.put("/updateCommunityChat/:_id",upload,community.updateCommunityChat);

///delete
communityRouter.delete("/deleteCommunity/:_id", community.deleteCommunity);
communityRouter.delete("/banFromCommunity/:_id", community.banFromCommunity);
communityRouter.delete(
  "/leaveChatCommunity/:_id",
  community.leaveChatCommunity
);
communityRouter.delete(
  "/deleteCommunityChat/:_id",
  community.deleteCommunityChat
);

//get
communityRouter.get("/getCommunities", community.getCommunities);
communityRouter.get("/getCommunity/:_id", community.getCommunity);
communityRouter.get(
  "/getCommunitiesForCategories",
  community.getCommunitiesForCategories
);
communityRouter.get("/getCommunityChats/:_id", community.getCommunityChats);
communityRouter.get("/hotCommunity", community.hotCommunity);// documentar


export default communityRouter;

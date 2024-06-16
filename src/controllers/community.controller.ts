import { Request, Response,  } from "express";
import Community, { community } from "../model/community";
import CommunityChats, { communitychats } from "../model/communityChats";
import User, { user } from "../model/user";
import CommunityCategory,{communitycategory} from "../model/communityCategory";
import {guardarImagen } from "./uploadImage";
import communityCategory from "../model/communityCategory";
const mongoose = require('mongoose');



const createCommunity = async (req:Request,res:Response) => {
  try {
    const { ...data } = req.body;
    const categorias=data.communityCategory_id;
    const array= categorias.split(',');
    const IDs=[];
    let categories:communitycategory;
    let n=0;

    for (let i=0; i < array.length; i++) {
      categories= await CommunityCategory.findOne({code:array[n]});
      if (categories) {
        IDs.push(categories._id)
        n++
       }
    }
      if(Community.name==data.name){
        res.status(400).send({
          ok: true,
          mensaje: "Nombre para comunidad no disponible",
          message: "Community name not available",
        });

      }
      else
      { 
        
        guardarImagen(req)
        const img = await guardarImagen(req);

      const create: community = await new Community({...data, communityCategory_id:IDs,img:img });
      await create.save();

      res.status(201).send({
        ok: true,
        community: create,
        mensaje: "Comunidad creada con éxito",
        message: "Community created successfully",
      });

      }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const getCommunities = async (req: Request, res: Response) => {
  try {
    const commmunity = await Community.find({ isActive: true });

    res.status(200).send({
      ok: true,
      data: commmunity,
      mensaje: "todas las comunidades",
      message: "all communities",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
      error,
    });
  }
};
 
const updateCommunity = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { ...data } = req.body;
    const community: community | null = await Community.findById({ _id });

    if(community?.owner_id== data.userID || community?.admins_id==data.userID)
      {
        if (!community || community.isActive==false) 
          {
            return res.status(400).send({
              ok: false,
              mensaje: "Comunidad no encontrada",
              message: "Community not found",
            });
          }
        else
        {
          const communityUpdate: community | null = await Community.findByIdAndUpdate(_id,{ ...data },{ new: true });
          res.status(200).send
          ({
            ok: true,
            communityUpdate,
            mensaje: "Communidad actualizada con exito",
            message: "Community updated successfully",
          });
        }

      }
  else{
    res.status(400).send
          ({
            ok: true,
            mensaje: "Solo el dueño y los admins pueden actualizar la comunidad",
            message: "Only the owner and admins can update the comunity",
          });

      }
 } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const {...data}= req.body;
    const community: community | null = await Community.findById({_id });
    const owner: user | null = await User.findById(data.ownerID);
    if(community?.owner_id== owner?._id)
      {

        if(!community || community.isActive==false){
          res.status(404).json({
            ok: false,
            mensaje: "no se encontro la comunidad",
            message: "community not found",
          });
        }
        else
        {
          const communityDelete: community | null = await Community.findByIdAndUpdate(
            community._id,
            { isDeleted: true, isActive: false },
            { new: true });
      
          res.status(200).send({
            ok: true,
            communityDelete,
            mensaje: "Comunidad eliminada con exito",
            message: "Community deleted successfully",
          });

        }
      }
  else{
    res.status(400).send({
      ok: false,
      mensaje: "Solo el dueño puede borrar la comunidad",
      message: "Community deleted successfully",
    });
  }
   
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const getCommunitiesForCategories = async (req: Request, res: Response) => {
  try {
    const {...data}= req.body;
    const IDs=[];
    const categories: communitycategory[]= await CommunityCategory.find({code:data.communityCategory_id});
    const commmunity: community[]= await Community.find({communityCategory_id:IDs});

    categories.forEach(function(categorías){IDs.push(categorías._id)})
    res.status(200).send({
      ok: true,
      commmunity,
      mensaje: "Todas las comunidades por estas categorías",
      message: "All communities for these categories",
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      error: error.message,
      mensaje: "Hubo un error al buscar las comunidades",
      message: "There was an error while fetching communities",
    });
  }
};

const joinCommunity = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const {_id} = req.params;
    const community: community= await Community.findById(_id);
    const member: user = await User.findById(data.memberID);

    if (community && member) {
      if (community.bannedUsers_id.includes(member._id)) {
        res.status(200).send({
          ok: true,
          mensaje: "Estás baneado de esta comunidad",
          message: "You are banned from this community",
        });
      } else {
        await community.updateOne({ $push: { members_id: member._id } });
        res.status(200).send({
          ok: true,
          mensaje: "Te uniste a la comunidad con éxito",
          message: "You joined the community successfully",
        });
      }
    } else {
      res.status(404).send({
        ok: false,
        mensaje: "No se encontró la comunidad o el usuario",
        message: "Community or user not found",
        
      });
      console.log(community)

    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const banFromCommunity = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const { _id } = req.params;
    const community: community | null = await Community.findById({_id});
    const user = await User.findOne({ _id: data.userID});
    const bannedEmail = await User.findOne({ _id: data.bannedID });

    if (
      community?.owner_id == user?._id ||community?.admins_id.find(user?._id))
      {
      const ban = await community?.updateOne({
        $push: { bannedUsers_id: bannedEmail?._id },
        $pull: { members_id: bannedEmail?._id },
      });

      res.status(200).send({
        ok: true,
        ban,
        mensaje: "Usuario baneado de la comunidad con exito",
        message: "User Banned from the community successfully",
      });
    } else {
      res.status(400).send({
        ok: false,
        mensaje:"Solamante el dueño y los administradores de la comunidad pueden banear usuarios",
        message: "Only the owner and community admins can ban users",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const assignAdmins = async (req: Request, res: Response) => {
  try {
   const { ...data } = req.body;
   const { _id } = req.params;

   const community: community | null = await Community.findById(_id.trim());

    
    const ownerID: user = await User.findOne({ _id: data.ownerID });
    const adminID: user = await User.findOne({ _id: data.adminID });
    console.log(ownerID._id.toString());
    console.log(adminID._id);
    console.log(community.owner_id.toString())

    if (community.owner_id.toString() == ownerID._id.toString()) {
      const admin = await community?.update({$push: { admins_id: adminID._id }});

      res.status(200).send({
        ok: true,
        admin,
        mensaje: "administrador asignado con exito",
        message: "admin assigned successfully",
      });
    }
     else {
      res.status(400).send({
        ok: false,
        mensaje: "Solo el dueño puede asignar administradores",
        message: "Only the owner can assign adminis",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};



const getCommunityChats = async (req: Request, res: Response) => {
  try {
    const {_id}= req.params;
    const community: community | null = await Community.findById({ _id });
    if(community?.isActive==true){
    const chats = await Community.find({community_id: community._id });

    res.status(200).send({
      ok: true,
      data: chats,
      mensaje: "todos los chats de la comunidad",
      message: "all community chats",
    });
  }
  else{
    res.status(404).send({
      ok: false,
      mensaje: "no se encontro la comunidas",
      message: "commmunity not found",
    });
  } 
}catch (error) {
    console.log(error);
    res.status(500).send({
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
      error,
    });
  }
};

const createChatCommunity = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    //const { _id } = req.params;
    const chats: communitychats= await new CommunityChats({isActive:true})

    if (chats.name == data.name && chats.community_id.toString() == data.communityid) {
        res.status(400).send({
        ok: true,
        mensaje: "Nombre para chat no disponible",
        message: "chat name not available",
      });

    }
    else
    {
    const create: communitychats = await new CommunityChats({...data });

    await create.save();

    res.status(201).send({
      ok: true,
      community: create,
      mensaje: "Nuevo chat creado con éxito",
      message: "New chat created successfully",
    });
   }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const joinChatCommunity = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const { _id } = req.params;
    const community: community | null= await Community.findById({ _id});
    const chat : communitychats| null= await CommunityChats.findById({_id: data.chatID});
    const user = await User.findOne({ _id: data.userID });

    if (!community.members_id.includes(user._id)) {
      res.status(400).send({
        ok: true,
        mensaje: "Debes pertenecer a la comunidad para unirte al chat",
        message: "You must belong to the community to join the chat",
      });
    } else {
      const join = await chat?.updateOne({ $push: { members_id: user?._id } });

      res.status(200).send({
        ok: true,
        join,
        mensaje: "Te uniste al chat con exito",
        message: "You joined the chat successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
      
    });
  }

};

const leaveChatCommunity = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const { _id } = req.params;
    const chat: communitychats | null= await CommunityChats.findById( _id );

    const user = await User.findById({ _id: data.userID });

    const join = await chat?.updateOne({ $pull: { members_id: user?._id } });

    res.status(200).send({
      ok: true,
      join,
      mensaje: "dejaste el chat con exito",
      message: "You leave the chat successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};
const deleteCommunityChat = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { ...data } = req.params;
    const chat: communitychats | null= await CommunityChats.findById({_id})
    const owner: user | null = await User.findById(data.ownerID);
  
  
    if(!chat){
      res.status(400).json({
        ok: false,
        mensaje: "no se encontro el chat",
        message: "chat not found",
      });
    }
    else
    {
      if(chat?.chatOwner_id== owner?._id)
        {
      const communityDelete: community | null = await Community.findByIdAndUpdate(
        chat._id,
        { isDeleted: true, isActive: false },
        { new: true });
  
      res.status(200).send({
        ok: true,
        communityDelete,
        mensaje: "chat eliminado con exito",
        message: "Chat deleted successfully",
      });

    }
    else
    {
      res.status(400).send({
        ok: false,
        mensaje: "Solo el dueño del chat puede borrar",
        message: "only the chat owner can delete",
      });

    }
   
  } 
}catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};
const updateCommunityChat = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { ...data } = req.body;
    const chat: communitychats | null = await CommunityChats.findById({ _id });

    if (!chat) {
      return res.status(404).send({
        ok: false,
        mensaje: "chat no encontrado",
        message: "chat not found",
      });
    }
    else
    {
    const communityUpdate: communitychats | null = await CommunityChats.findByIdAndUpdate(_id,
      { ...data },
      { new: true }
    );
    res.status(200).send({
      ok: true,
      communityUpdate,
      mensaje: "Chat actualizado con exito",
      message: "Chat updated successfully",
    });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};
export {
  getCommunitiesForCategories,
  createCommunity,
  getCommunities,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  assignAdmins,
  banFromCommunity,
  deleteCommunityChat,
  joinChatCommunity,
  createChatCommunity,
  leaveChatCommunity,
  updateCommunityChat,
  getCommunityChats,
};
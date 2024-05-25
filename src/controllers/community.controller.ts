import { Request, Response } from "express";
import Community, { community } from "../model/community";
import CommunityChats ,{ communitychats } from "../model/communityChats";


const createCommunity = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;

    const create: community = await new Community({ ...data });
    await create.save();

    res.status(201).send({
      ok: true,
      community: create,
      mensaje: "Comunidad creada con éxito",
      message: "Community created successfully",
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

const getcommunities = async (req: Request, res: Response) => {
  try {
    const communities = await Community.find({  isActive: true });


    res.status(200).send({
      ok: true,
      communities,
      mensaje:"todas las comunidades",
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
    const { id } = req.params;
    const { ...data } = req.body;

    const community: community = await Community.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );

    res.status(200).send({
      ok: true,
      community,
      mensaje: "Communidad actualizada con exito",
      message: "Community updated successfully",
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

const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const community: community = await Community.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { new: true }
    );

    res.status(200).send({
      ok: true,
      community,
      mensaje: "Comunidad eliminada con exito",
      message: "Community deleted successfully",
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

const getcommunitiesForCategories= async (req: Request, res: Response) => {
    try {
        const promises = req.body.map(async (item) => {
            const community = await Community.find(item);
            return community;
        });
    
        const communities = await Promise.all(promises);
    
        res.status(200).send({
            ok: true,
            communities,
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
      const { id } = req.params;
      const community: community = await Community.findById(id)
      if(community.bannedUsers_id.find(req.body))
        {
            res.status(200).send({
                ok: true,
                mensaje: "Estas baneado de esta comunidad",
                message: "You are banned from this community",
              });
        }
        else{
        const join = await community.updateOne({$push:{member_id: req.body}});

  
      res.status(200).send({
        ok: true,
        join,
        mensaje: "Te uniste a la comunidad con exito",
        message: "You joined the community successfully",
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

  
const banFromCommunity = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const community: community = await Community.findById(id)

      if(community.owner_id == req.body.user_id || community.admins_id.find(req.body.user_id)){
      const ban = await community.updateOne({$push:{bannedUsers_id: req.body.bannedUser_id},
                                             $pull:{members_id: req.body.bannedUser_id}});

  
      res.status(200).send({
        ok: true,
        ban,
        mensaje: "Usuario baneado de la comunidad con exito",
        message: "User Banned from the community successfully",
      });
    }
    else{     
        res.status(200).send({
        ok: true,
        mensaje: "Solamante el dueño y los administradores de la comunidad pueden banear usuarios",
        message: "Only the owner and community admins can ban users"
        ,})
    }
}
    catch (error) {
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
      const { id } = req.params;
      const community: community = await Community.findById(id)
      if(community.owner_id == req.body.owner_id)
        {
      const admin = await community.update({$push:{admins_id:req.body.newAdmin_id}});

  
      res.status(200).send({
        ok: true,
        admin,
        mensaje: "administrador asignado con exito",
        message: "admin assigned successfully",
      });
    }
    else 
    {
        res.status(200).send({
            ok: true,
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


  const createChatCommunity = async (req: Request, res: Response) => {
    try {
      const { ...data } = req.body;
  
      const create: communitychats = await new CommunityChats({ ...data });
      await create.save();
  
      res.status(201).send({
        ok: true,
        community: create,
        mensaje: "Nuevo chat creado con éxito",
        message: "New chat created successfully",
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

  const joinChatCommunity = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const communitychats: communitychats = await CommunityChats.findById(id)
      const community: community = await Community.findById(communitychats.community_id)
      if(!community.members_id.find(req.body))
        {
            res.status(200).send({
                ok: true,
                mensaje: "Debes pertenecer a la comunidad para unirte al chat",
                message: "You must belong to the community to join the chat",
              });
        }
        else{
        const join = await communitychats.updateOne({$push:{member_id: req.body}});

  
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
      const { id } = req.params;
      const communitychats: communitychats = await CommunityChats.findById(id)
      const community: community = await Community.findById(communitychats.community_id)
      if(!community.members_id.find(req.body))
        {
            res.status(200).send({
                ok: true,
                mensaje: "Debes pertenecer a la comunidad para salirte al chat",
                message: "You must belong to the community to leave the chat",
              });
        }
        else{
        const join = await communitychats.updateOne({$pull:{member_id: req.body}});

  
      res.status(200).send({
        ok: true,
        join,
        mensaje: "dejaste el chat con exito",
        message: "You leave the chat successfully",
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


export { createCommunity, getcommunities, updateCommunity, deleteCommunity, joinChatCommunity,joinCommunity,
         createChatCommunity,banFromCommunity,assignAdmins,leaveChatCommunity,getcommunitiesForCategories};

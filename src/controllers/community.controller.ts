import { Request, Response } from "express";
import Community, { community } from "../model/community";
import CommunityChats, { communitychats } from "../model/communityChats";
import User, { user } from "../model/user";
import CommunityCategory, {communitycategory,} from "../model/communityCategory";
import { guardarImagenes, deleteImage, perfiles } from "./uploadImage";

const createCommunity = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const categorias = data.communityCategory_id;
    const array = categorias.split(",");
    const IDs = [];
    let categories: communitycategory;
    let n = 0;

    for (let i = 0; i < array.length; i++) {
      categories = await CommunityCategory.findOne({ code: array[n] });
      if (categories) {
        IDs.push(categories._id);
        n++;
      }
    }
    if (Community.name == data.name) {
      res.status(400).send({
        ok: true,
        mensaje: "Nombre para comunidad no disponible",
        message: "Community name not available",
      });
    } else {
      const img = await perfiles(req);
      const { imgUrl } = img;
      const { bannerUrl } = img;

      const create: community = await new Community({
        ...data,
        communityCategory_id: IDs,
        img: imgUrl ? imgUrl : null,
        banner:bannerUrl? bannerUrl:null,
        
      });
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

const getCommunity = async (req, res) => {
  try {
    const { _id } = req.params;
    const { ...data } = req.body;

    // Obtener todas las comunidades activas para sus hotScores
    const communities = await Community.find({ isActive: true });

    // Crear un array con los hotScores de todas las comunidades
    const hotScoresArray = communities.map((community) => community.hotScore);

    // Ordenar el array de hotScores en orden descendente
    hotScoresArray.sort((a, b) => b - a);

    // Obtener la comunidad específica
    const community = await Community.findById(_id)
      .populate("members_id")
      .populate("owner_id")
      .populate("admins_id");

    if (!community) {
      return res.status(404).send({
        ok: false,
        mensaje: "Comunidad no encontrada",
        message: "Community not found",
      });
    }

    if (data.user_id) {
      const user = await User.findOne({ _id: data?.user_id });

      if (community.bannedUsers_id.includes(user._id)) {
        return res.status(418).send({
          ok: false,
          data: community,
          mensaje: "Usuario baneado",
          message: "User banned",
        });
      }
    }

    // Obtener el hotScore de la comunidad específica
    const specificCommunityHotScore = community.hotScore;

    // Encontrar la posición del hotScore de la comunidad específica en el array
    const rango = hotScoresArray.indexOf(specificCommunityHotScore) + 1;

    res.status(200).send({
      ok: true,
      data: community,
      Rank:rango,
      mensaje: "Comunidad obtenida con éxito",
      message: "Community retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
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
    if (
      //validacion de permisos para actualizar
      community?.owner_id == data.userID ||
      community?.admins_id == data.userID
    ) {
      if (!community || community.isActive == false) {
        //validacion de existencia
        return res.status(400).send({
          ok: false,
          mensaje: "Comunidad no encontrada",
          message: "Community not found",
        });
      } else {//si existe
        const img = await perfiles(req);
        const { imgUrl } = img;
        const { bannerUrl } = img;
        let banner;
        let profilePictur;
    
        if(community.banner==null){ banner=bannerUrl;}//si no hay banner en firebase
        else if(data.banner != community.banner ){deleteImage(community.banner); banner=bannerUrl;}//si hay banner en firebase
        else if(!data.banner && req.files['banner'] == null && community.banner!=null){deleteImage(community.banner); banner=null;}//si se queda sin banner
        else if(data.banner){banner=data.banner;}//dejar banner

        if(community.img==null){profilePictur=imgUrl;} //si no hay img en firebase
        else if(data.banner != community.img  ){deleteImage(community.img);profilePictur=imgUrl;}//si hay img en firebase
        else if(!data.img && req.files['img'] == null && community.img!=null){deleteImage(community.img);profilePictur=null;}//si se queda sin img
        else if(data.img){profilePictur=data.img;}//dejar img

        const communityUpdate: community | null =
          await Community.findByIdAndUpdate(
            _id,
            { ...data,img: profilePictur ? profilePictur : null,
              banner:banner? banner:null,},
            { new: true }
          );
        res.status(200).send({
          ok: true,
          communityUpdate,
          mensaje: "Communidad actualizada con exito",
          message: "Community updated successfully",
        });
      }
    } else {
      //sin permisos
      res.status(400).send({
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
    const { ...data } = req.body;
    const community: community | null = await Community.findById({ _id });
    const owner: user | null = await User.findById(data.ownerID);
    console.log(community.owner_id, "bueno", owner._id);
    if (community.owner_id.equals(owner._id)) {
      if (!community || community.isActive == false) {
        res.status(404).json({
          ok: false,
          mensaje: "no se encontro la comunidad",
          message: "community not found",
        });
      } else {
        const communityDelete: community | null =
          await Community.findByIdAndUpdate(
            community._id,
            { isDeleted: true, isActive: false },
            { new: true }
          );

        res.status(200).send({
          ok: true,
          communityDelete,
          mensaje: "Comunidad eliminada con exito",
          message: "Community deleted successfully",
        });
      }
    } else {
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

const leaveCommunity = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const { _id } = req.params;
    const commmunity: community | null = await Community.findById(_id);
    const user = await User.findOne({ _id: data.userID });
    const join = await commmunity?.updateOne({
      $pull: { members_id: user?._id },
    });

    res.status(200).send({
      ok: true,
      join,
      mensaje: "Abandonaste la comunidad con exito",
      message: "You leave the community successfully",
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

const getCommunitiesForCategories = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const IDs = [];
    const categories: communitycategory[] = await CommunityCategory.find({
      code: data.communityCategory_id,
    });
    const commmunity: community[] = await Community.find({
      communityCategory_id: IDs,
    });

    categories.forEach(function (categorías) {
      IDs.push(categorías._id);
    });
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
    const { _id } = req.params;
    const community: community = await Community.findById(_id);
    const member: user = await User.findById(data.memberID);

    if (community && member) {
      if (community.bannedUsers_id.includes(member._id)) {
        res.status(418).send({
          ok: false,
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
      console.log(community);
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
    const community: community | null = await Community.findById({ _id });
    const user = await User.findOne({ _id: data.userID });
    const banned = await User.findOne({ _id: data.bannedID });

    console.log(user?._id);
    console.log(banned._id);
    console.log(community?.owner_id);

    if (
      community?.owner_id.equals(user?._id) ||
      community?.admins_id.includes(user?._id)
    ) {
      const ban = await community?.updateOne({
        $push: { bannedUsers_id: banned?._id },
        $pull: { members_id: banned?._id },
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
        mensaje:
          "Solamante el dueño y los administradores de la comunidad pueden banear usuarios",
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
    console.log(community.owner_id.toString());

    if (community.owner_id.toString() == ownerID._id.toString()) {
      const admin = await community?.update({
        $push: { admins_id: adminID._id },
      });

      res.status(200).send({
        ok: true,
        admin,
        mensaje: "administrador asignado con exito",
        message: "admin assigned successfully",
      });
    } else {
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
    const { _id } = req.params;
    const community: community | null = await Community.findById({ _id });
    if (community?.isActive == true) {
      const chats = await CommunityChats.find({ community_id: community._id });

      res.status(200).send({
        ok: true,
        data: chats,
        mensaje: "todos los chats de la comunidad",
        message: "all community chats",
      });
    } else {
      res.status(404).send({
        ok: false,
        mensaje: "no se encontro la comunidas",
        message: "commmunity not found",
      });
    }
  } catch (error) {
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
    const chats: communitychats = await new CommunityChats({ isActive: true });

    if (
      chats.name == data.name &&
      chats.community_id.toString() == data.communityid
    ) {
      res.status(400).send({
        ok: true,
        mensaje: "Nombre para chat no disponible",
        message: "chat name not available",
      });
    } else {
      const img = await perfiles(req);
      const { imgUrl } = img;
      const { bannerUrl } = img;
      const create: communitychats = await new CommunityChats({
        ...data,
        img: imgUrl ? imgUrl : null,
        banner:bannerUrl? bannerUrl:null,
      });

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
    const community: community | null = await Community.findById({ _id });
    const chat: communitychats | null = await CommunityChats.findById({
      _id: data.chatID,
    });
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
    const chat: communitychats | null = await CommunityChats.findById(_id);
    const user = await User.findOne({ _id: data.userID });
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
    const { ...data } = req.body;
    const chat: communitychats | null = await CommunityChats.findById({ _id });
    const owner = await User.findOne({ _id: data.ownerID });

    if (chat.isActive == false) {
      res.status(400).json({
        ok: false,
        mensaje: "no se encontro el chat",
        message: "chat not found",
      });
    } else {
      if (chat?.chatOwner_id.equals(owner?._id)) {
        const communityDelete: communitychats | null =
          await CommunityChats.findByIdAndUpdate(
            chat._id,
            { isDeleted: true, isActive: false },
            { new: true }
          );
        res.status(200).send({
          ok: true,
          communityDelete,
          mensaje: "chat eliminado con exito",
          message: "Chat deleted successfully",
        });
      } else {
        res.status(400).send({
          ok: false,
          mensaje: "Solo el dueño del chat puede borrar",
          message: "only the chat owner can delete",
        });
      }
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
    } else {
      guardarImagenes(req);
      const img = await guardarImagenes(req);

      const communityUpdate: communitychats | null =
        await CommunityChats.findByIdAndUpdate(
          _id,
          { ...data, img: img },
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
const hotCommunity = async (req, res) => {
  try {
    const communities = await Community.find({ isActive: true });

    const calculateHotScore = (community) => {
      const createdAt = community.created_at; // Asegúrate de usar el campo correcto de tu esquema
      const members = community.members_id.length || 0;
      const ageInHours = (Date.now() - new Date(createdAt).getTime()) / 36e5;
      return (members / (ageInHours + 2));
    };

    // Calcular la puntuación de "Hot" para cada comunidad
    communities.forEach((community) => {
      community.hotScore = calculateHotScore(community);
    });

    // Ordenar las comunidades por la puntuación de "Hot"
    communities.sort((a, b) => b.hotScore - a.hotScore);
    const topSixCommunities = communities.slice(0, 6);

    // Actualizar las comunidades en la base de datos
    const updatePromises = communities.map((community) => {
      return Community.findByIdAndUpdate(community._id, { hotScore: community.hotScore }, { new: true });
    });

    await Promise.all(updatePromises);

    res.status(200).send({
      ok: true,
      data: topSixCommunities,
      mensaje: "Comunidad destacada con éxito",
      message: "Community featured successfully",
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

export {
  getCommunitiesForCategories,
  createCommunity,
  getCommunities,
  getCommunity,
  updateCommunity,
  deleteCommunity,
  leaveCommunity,
  joinCommunity,
  assignAdmins,
  banFromCommunity,
  deleteCommunityChat,
  joinChatCommunity,
  createChatCommunity,
  leaveChatCommunity,
  updateCommunityChat,
  getCommunityChats,
  hotCommunity,
};

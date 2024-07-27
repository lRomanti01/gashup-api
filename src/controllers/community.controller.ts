import { Request, Response } from "express";
import Community, { community } from "../model/community";
import CommunityChats, { communitychats } from "../model/communityChats";
import User, { user } from "../model/user";
import CommunityCategory, {
  communitycategory,
} from "../model/communityCategory";
import { guardarImagenes, deleteImage, perfiles } from "./uploadImage";

const createCommunity = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const array =JSON.parse( data.communityCategory_id);
    const IDs = [];
    let categories: communitycategory;
    let n = 0;

    for (let i = 0; i < array.length; i++) {
      categories = await CommunityCategory.findOne({ _id: array[n] });
      if (categories) {
        IDs.push(categories._id);
        n++;
      }
    }
    const community = await Community.findOne({ name: data.name });

    if (community) {
      return res.status(400).send({
        ok: false,
        mensaje: "Nombre para comunidad no disponible",
        message: "Community name not available",
      });
    }

    const img = await perfiles(req);
    const { imgUrl } = img;
    const { bannerUrl } = img;

    const create: community = await new Community({
      ...data,
      communityCategory_id: IDs,
      img: imgUrl ? imgUrl : null,
      banner: bannerUrl ? bannerUrl : null,
    });
    await create.save();

    res.status(201).send({
      ok: true,
      data: create.toJSON(),
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

const getCommunities = async (req: Request, res: Response) => {
  try {
    const commmunity = await Community.find({ isActive: true }).populate(
      "communityCategory_id"
    );

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

const getCommunity = async (req: Request, res: Response) => {
  try {
    const { _id, user_id } = req.params;
    const { ...data } = req.body;

    const communities = await Community.find({ isActive: true });

    const hotScoresArray = communities.map((community) => community.hotScore);
    hotScoresArray.sort((a, b) => b - a);

    let communityQuery = Community.findById(_id)
      .populate("owner_id");

    // Verificar si hay members_id y admins_id antes de hacer populate
    const communityCheck = await Community.findById(_id).lean();
    if (communityCheck.members_id && communityCheck.members_id.length > 0) {
      communityQuery = communityQuery.populate("members_id");
    }
    if (communityCheck.admins_id && communityCheck.admins_id.length > 0) {
      communityQuery = communityQuery.populate("admins_id");
    }

    const community = await communityQuery.exec();

    if (!community) {
      return res.status(404).send({
        ok: false,
        mensaje: "Comunidad no encontrada",
        message: "Community not found",
      });
    }

    if (user_id) {
      const user = await User.findOne({ _id: user_id });

      if (community.bannedUsers_id.includes(user._id)) {
        return res.status(200).send({
          ok: false,
          data: community,
          banned: true,
          mensaje: "Usuario baneado",
          message: "User banned",
        });
      }
    }

    const specificCommunityHotScore = community.hotScore;
    const rango = hotScoresArray.indexOf(specificCommunityHotScore) + 1;

    res.status(200).send({
      ok: true,
      data: { ...community.toJSON(), rank: rango },
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

    const community = await Community.findById(_id);
    if (!community || !community.isActive) {
      return res.status(400).send({
        ok: false,
        mensaje: "Comunidad no encontrada",
        message: "Community not found",
      });
    }

    const ban = JSON.parse(data.bannedUsers_id); 

    // Update banned users
    if (data.bannedUsers_id && ban.length > 0) {
      const bannedUsers = await User.find({ _id: { $in: ban } });
      const bannedUserIds = bannedUsers.map(user => user._id);
      await community.updateOne({
        $set: { bannedUsers_id: bannedUserIds },
        $pull: { members_id: { $in: bannedUserIds } },
      });
    }

    const admin = JSON.parse(data.admins_id);
    // Update admin users
    if (data.admins_id && admin.length > 0) {
      const adminUsers = await User.find({ _id: { $in: admin } });
      const adminUserIds = adminUsers.map(user => user._id);
      await community.updateOne({
        $set: { admins_id: adminUserIds },
      });
    }
    const CAT = JSON.parse(data.communityCategory_id); 

    // Update categories
    if (data.communityCategory_id && CAT.length > 0) {
      const categories = await CommunityCategory.find({ _id: { $in: CAT } });
      const categoryIds = categories.map(category => category._id);
      await community.updateOne({
        $set: { category_id: categoryIds },
      });
    }

    // Update images
    const img = await perfiles(req);
    const { imgUrl, bannerUrl } = img;

    let banner = community.banner;
    if (bannerUrl && data.banner !== community.banner) {
      if (community.banner) deleteImage(community.banner);
      banner = bannerUrl;
    }

    let profilePicture = community.img;
    if (imgUrl && data.img !== community.img) {
      if (community.img) deleteImage(community.img);
      profilePicture = imgUrl;
    }

    // Update community details
    const updatedCommunity = await Community.findByIdAndUpdate(
      _id,
      {
        name: data.name,
        description: data.description,
        img: profilePicture ? profilePicture : null,
        banner: banner ? banner : null
      },
      { new: true }
    );

    res.status(200).send({
      ok: true,
      data: updatedCommunity,
      mensaje: "Comunidad actualizada con éxito",
      message: "Community updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Oops! Something went wrong",
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
    
    // Buscar la comunidad por ID
    const community = await Community.findById(_id);
    if (!community) {
      return res.status(404).send({
        ok: false,
        mensaje: "Comunidad no encontrada",
        message: "Community not found",
      });
    }

    // Buscar el usuario que realiza la acción y el usuario a ser baneado
    const user = await User.findOne({ _id: data.userID });
    const banned = await User.findOne({ _id: data.bannedID });

    if (!user || !banned) {
      return res.status(404).send({
        ok: false,
        mensaje: "Usuario no encontrado",
        message: "User not found",
      });
    }

    if (
      community.owner_id.equals(user._id) ||
      community.admins_id.includes(user._id)
    ) {
      // Banear al usuario de la comunidad
      const ban = await community.updateOne({
        $push: { bannedUsers_id: banned._id },
        $pull: { members_id: banned._id },
      });

      // Sacar al usuario de todos los chats de esa comunidad
      await CommunityChats.updateMany(
        { community_id: community._id },
        { $pull: { members_id: banned._id } }
      );

      res.status(200).send({
        ok: true,
        ban,
        mensaje: "Usuario baneado de la comunidad y chats con éxito",
        message: "User banned from the community and chats successfully",
      });
    } else {
      res.status(400).send({
        ok: false,
        mensaje:
          "Solamente el dueño y los administradores de la comunidad pueden banear usuarios",
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

    // Buscar el usuario
    const user: user = await User.findOne({ _id });

    if (!user) {
      return res.status(404).send({
        ok: false,
        mensaje: "Usuario no encontrado",
        message: "User not found",
      });
    }

    // Buscar comunidades a las que el usuario es miembro
    const memberCommunities = await Community.find({ members_id: user._id });

    // Buscar comunidades que el usuario posee (suponiendo que tienes un campo 'owner_id' en el esquema de la comunidad)
    const ownedCommunities = await Community.find({ owner_id: user._id });

    // Unir las comunidades en una sola lista y eliminar duplicados
    const allCommunities = [...memberCommunities, ...ownedCommunities];
    const uniqueCommunityIds = [...new Set(allCommunities.map(community => community._id))];

    if (uniqueCommunityIds.length > 0) {
      // Buscar chats en esas comunidades
      const chats = await CommunityChats.find({ community_id: { $in: uniqueCommunityIds } });

      // Verificar si el usuario es miembro del chat
      const chatsWithMembership = chats.map((chat) => {
        const isMember = chat.members_id.includes(user._id);
        return {
          ...chat.toObject(),
          isMember: isMember ? true : false
        };
      });

      res.status(200).send({
        ok: true,
        data: chatsWithMembership,
        mensaje: "Todos los chats de las comunidades a las que eres miembro o dueño",
        message: "All community chats you are a member of or owner",
      });
    } else {
      res.status(404).send({
        ok: false,
        mensaje: "No se encontraron comunidades para el usuario",
        message: "No communities found for the user",
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
      const create: communitychats = await new CommunityChats({
        ...data,
        img: imgUrl ? imgUrl : null,
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
      return members / (ageInHours + 2);
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
      return Community.findByIdAndUpdate(
        community._id,
        { hotScore: community.hotScore },
        { new: true }
      );
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

const findCommunity = async (req: Request, res: Response) => {
  try {
    const { ID } = req.params;

    // Buscar usuario por ID
    const user = await User.findById(ID);

    if (!user) {
      return res.status(404).send({
        ok: false,
        mensaje: "Usuario no encontrado",
        message: "User not found",
      });
    }

    // Buscar comunidades en las que el usuario es miembro
    const memberCommunities = await Community.find({ members_id: user._id });

    // Buscar comunidades que el usuario posee
    const ownedCommunities = await Community.find({ owner_id: user._id });

    // Unir las comunidades en una sola lista y eliminar duplicados
    const allCommunities = [...memberCommunities, ...ownedCommunities];

    if (allCommunities.length > 0) {
      res.status(200).send({
        ok: true,
        Menber: memberCommunities,
        Owner: ownedCommunities,

        mensaje: "Comunidades a las que eres miembro o dueño",
        message: "Communities you are a member of or owner",
      });
    } else {
      res.status(404).send({
        ok: false,
        mensaje: "No se encontraron comunidades para el usuario",
        message: "No communities found for the user",
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

//chat
const findCommunityChats = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;

    // Buscar la comunidad por ID
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).send({
        ok: false,
        mensaje: "Comunidad no encontrada",
        message: "Community not found",
      });
    }

    // Buscar chats en esa comunidad que contengan el nombre parcial
    const chats = await CommunityChats.find({ 
      community_id: community._id,
    });

    res.status(200).send({
      ok: true,
      data: chats,
      mensaje: "Todos los chats de la comunidad",
      message: "All chats of the community",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      mensaje: "¡Ups! Algo salió mal",
      message: "Oops! Something went wrong",
      error,
    });
  }
};

// Categories

const createCategory = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const create: communitycategory = await new CommunityCategory({ ...data });
    await create.save();

    res.status(201).send({
      ok: true,
      community: create,
      mensaje: "Categoria creada con éxito",
      message: "Category created successfully",
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

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CommunityCategory.find({});

    res.status(200).send({
      ok: true,
      data: categories,
      mensaje: "Categorias encontradas con exito",
      message: "Categories found successfully",
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
  createCategory,
  getCategories,
  findCommunity,
  findCommunityChats
};

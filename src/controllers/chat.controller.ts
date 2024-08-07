import { getDatabase, ref, push, set , update, remove,onValue } from "firebase/database";
import { Request, Response } from "express";
import User, { user } from "../model/user";
import moment from "moment";
import { calculateElapsedTime } from "../helper/date";
import Community, { community } from "../model/community";
import CommunityChats, { communitychats } from "../model/communityChats";
import communityChats from "../model/communityChats";


const sendMessage = async (req: Request, res: Response) => {
  try {
    const { userID, message } = req.body;
    const { communityID, chatID } = req.params;

    // Validación básica
    if (!userID || !message) {
      return res.status(400).send({
        ok: false,
        mensaje: "Datos incompletos",
        message: "Incomplete data"
      });
    }
    const user = await User.findById({_id: userID })

    const db = getDatabase();
    const chatRef = ref(db, `${communityID}/${chatID}`);

    // Usar push() para generar una clave única para cada mensaje
    const newMessageRef = push(chatRef);

    await set(newMessageRef, {
      userID: userID,
      username: user.name,
      img: user.img,
      message: message,
      publicationDate: moment().format("YYYY-MM-DD HH:mm:ss")
    });

    res.status(200).send({
      ok: true,
      mensaje: "Mensaje enviado",
      message: "Message sent"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
      error: error.message
    });
  }
};
const updateMessage = async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const {communityID,chatID,messageID} = req.params;
  
      // Validación básica
      if (!message) {
        return res.status(400).send({
          ok: false,
          mensaje: "Datos incompletos",
          message: "Incomplete data"
        });
      }
  
      const db = getDatabase();
      const messageRef = ref(db, `${communityID}/${chatID}/${messageID}`);
  
      await update(messageRef, {
        message: message,
        publicationDate: moment().format("YYYY-MM-DD HH:mm:ss")
      });
  
      res.status(200).send({
        ok: true,
        mensaje: "Mensaje actualizado",
        message: "Message updated"
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        mensaje: "¡Ups! Algo salió mal",
        message: "Ups! Something went wrong",
        error: error.message
      });
    }
  };

  const deleteMessage = async (req: Request, res: Response) => {
    try {
      const { communityID, chatID, messageID } = req.params;
  
      const db = getDatabase();
      const messageRef = ref(db, `${communityID}/${chatID}/${messageID}`);
  
      await remove(messageRef);
  
      res.status(200).send({
        ok: true,
        mensaje: "Mensaje eliminado",
        message: "Message deleted"
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        mensaje: "¡Ups! Algo salió mal",
        message: "Ups! Something went wrong",
        error: error.message
      });
    }
  };
  
  const getChatByID = async (req: Request, res: Response) => {
    try {
      const { ID} = req.params;
  
      const chat = (await communityChats.findById({_id:ID}));
  

      res.status(200).send({
        ok: true,
        data: chat,
        mensaje: "chat obtenido con éxito",
        message: "chat retrieved successfully",
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

  const getMembers = async (req: Request, res: Response) => {
    try {
      const { ID } = req.params;
  
      const chat = await communityChats.findById({ _id: ID }).populate("members_id");
      
      chat.members_id.forEach((member: any) => {
        member.followed = member.followed.length;
        member.followers = member.followers.length;
      });
  
      res.status(200).send({
        ok: true,
        data: chat,
        mensaje: "miembros del chat obtenidos con éxito",
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
  
  const userChats = async (req: Request, res: Response) => {
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
  
      // Buscar chats activos en CommunityChats y filtrar para obtener solo los chats en los que el usuario es miembro
      const chats = await communityChats.find({
        isActive: true,  // Suponiendo que hay un campo isActive que indica si el chat está activo
        members_id: { $in: [user._id] },  // Filtrar para obtener solo los chats en los que el usuario es miembro
      });
  
      res.status(200).send({
        ok: true,
        data: chats,
        mensaje: "Todos los chats en los que eres miembro",
        message: "All chats you are a member of",
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
  
  const findChat = async (req: Request, res: Response) => {
    try {
      const { ID, name } = req.params;
  
      // Buscar el usuario por ID
      const user = await User.findById(ID);
  
      if (!user) {
        return res.status(404).send({
          ok: false,
          mensaje: "Usuario no encontrado",
          message: "User not found",
        });
      }
  
      // Buscar chats donde el usuario es miembro y que contengan el nombre parcial
      const chats = await CommunityChats.find({ 
        members_id: user._id,
        name: { $regex: name, $options: 'i' }  // Buscar chats que contengan el nombre parcial (insensible a mayúsculas)
      });
  
      res.status(200).send({
        ok: true,
        data: chats,
        mensaje: "Todos los chats de las comunidades a las que eres miembro",
        message: "All community chats you are a member of",
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
  


export { sendMessage, updateMessage, deleteMessage,getChatByID,getMembers, findChat, userChats};



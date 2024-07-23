import { getDatabase, ref, push, set , update, remove,onValue } from "firebase/database";
import { Request, Response } from "express";
import User, { user } from "../model/user";
import moment from "moment";
import { calculateElapsedTime } from "../helper/date";
import Community, { community } from "../model/community";
import CommunityChats, { communitychats } from "../model/communityChats";


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
  
  const getMessages = async (req: Request, res: Response) => {
    try {
      const { communityID, chatID } = req.params;
  
      const db = getDatabase();
      const dbRef = ref(db, `${communityID}/${chatID}`);
  
      onValue(dbRef, async (snapshot) => {
        if (snapshot.exists() && Object.keys(snapshot.val()).length > 0) {
          const data = snapshot.val();
          const userID = [];
          const usernames = [];
          const img = [];
          const messages = [];
  
          // Iterar sobre los mensajes y extraer los usernames y los datos de los mensajes
          for (const key in data) {
            if (data[key].username) {
              usernames.push(data[key].username);
              userID.push(data[key].userID);
              img.push(data[key].img);
            }
            if (data[key].message) {
              const mensaje = data[key].message;
            }
            // Añadir el mensaje al array
            messages.push({
              id: key,
              userID: data[key].ID,
              username: data[key].username,
              img: data[key].img,
              message: data[key].message,
              publicationDate: data[key].publicationDate,
            });
          }
  
          // Encontrar usuarios por ID
          try {
            const users = await User.find({ _id: { $in: userID } });
  
            res.status(200).send({
              ok: true,
              messages,
              users,
              mensaje: "Mensajes obtenidos",
              message: "Messages retrieved",
            });
          } catch (error) {
            console.error(error);
            res.status(500).send({
              mensaje: "¡Ups! Algo salió mal al buscar usuarios",
              message: "Ups! Something went wrong while fetching users",
              error: error.message,
            });
          }
        } else {
          res.status(200).send({
            ok: true,
            messages: [],
            users: [],
            mensaje: "No hay mensajes en este chat",
            message: "No messages in this chat",
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        mensaje: "¡Ups! Algo salió mal",
        message: "Ups! Something went wrong",
        error: error.message,
      });
    }
  };
  
  const findChat = async (req: Request, res: Response) => {
    try {
      const { ID } = req.params;
      const { name } = req.body;  // Nombre parcial pasado por el cuerpo de la solicitud
  
      // Buscar comunidades a las que el usuario es miembro
      const user = await User.findById({_id: ID })
      const filtro= name.toString();
  
      if (!user) {
        return res.status(404).send({
          ok: false,
          mensaje: "Usuario no encontrado",
          message: "User not found",
        });
      }
  
      const communities = await Community.find({ members_id: user._id });
  
      if (communities.length > 0) {
        // Obtener IDs de las comunidades
        const communityIds = communities.map(community => community._id);
  
        // Buscar chats en esas comunidades que contengan el nombre parcial
        const chats = await CommunityChats.find({ 
          community_id: { $in: communityIds },
          name: { $regex: filtro, $options: 'i' }  // Buscar chats que contengan el nombre parcial (insensible a mayúsculas)
        });
  
        // Verificar si el usuario es miembro del chat
        const chatsWithMembership = chats.map(chat => {
          const isMember = chat.members_id.includes(user._id);
          return {
            ...chat.toObject(),
            miembro: isMember ? true : false
          };
        });
  
        res.status(200).send({
          ok: true,
          data: chatsWithMembership,
          mensaje: "todos los chats de las comunidades a las que eres miembro",
          message: "all community chats you are a member of",
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
  
  
 
  
export { sendMessage, updateMessage, deleteMessage,getMessages, findChat};



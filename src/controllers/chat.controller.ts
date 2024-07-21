import { getDatabase, ref, push, set , update, remove,onValue } from "firebase/database";
import { Request, Response } from "express";
import User, { user } from "../model/user";
import moment from "moment";

const sendMessage = async (req: Request, res: Response) => {
  try {
    const { userID, message, chat } = req.body;
    const { communityID } = req.params;

    // Validación básica
    if (!userID || !message || !chat) {
      return res.status(400).send({
        ok: false,
        mensaje: "Datos incompletos",
        message: "Incomplete data"
      });
    }

    const db = getDatabase();
    const chatRef = ref(db, `${communityID}/${chat}`);

    // Usar push() para generar una clave única para cada mensaje
    const newMessageRef = push(chatRef);

    await set(newMessageRef, {
      username: userID,
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
        if (snapshot.exists()) {
          const data = snapshot.val();
          const usernames = [];
          const messages = [];
  
          // Iterar sobre los mensajes y extraer los usernames y los datos de los mensajes
          for (const key in data) {
            if (data[key].username) {
              usernames.push(data[key].username);
            }
            if (data[key].message) {
              const mensaje = data[key].message;
            }
            // Añadir el mensaje al array
            messages.push({
              id: key,
              message: data[key].message,
              publicationDate: data[key].publicationDate,
              username: data[key].username
            });
          }
  
  
          // Encontrar usuarios por ID
          try {
            const users = await User.find({ _id: { $in: usernames } });
  
            res.status(200).send({
              ok: true,
               messages,
              users: users,
              mensaje: "Mensajes obtenidos",
              message: "Messages retrieved"
            });
          } catch (error) {
            console.error(error);
            res.status(500).send({
              mensaje: "¡Ups! Algo salió mal al buscar usuarios",
              message: "Ups! Something went wrong while fetching users",
              error: error.message
            });
          }
        }
      },);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        mensaje: "¡Ups! Algo salió mal",
        message: "Ups! Something went wrong",
        error: error.message
      });
    }
  };
  
 
  
export { sendMessage, updateMessage, deleteMessage,getMessages};



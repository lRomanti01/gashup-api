import { Request, Response } from "express";
import User, { user } from "../model/user";
import Roles, { role } from "../model/role";
import { encrypt } from "../helper/password-bcrypts";
import { deleteImage, perfiles } from "./uploadImage";

const createUser = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;

    const encrypts = await encrypt(data.password);
    data.password = encrypts;
    let create = await new User();
    const role = await Roles.findOne({ code: data.code });
    const user = await User.findOne({ email: data.email });

    if (user) {
      return res.status(401).send({
        ok: false,
        mensaje: "Este usuario ya existe",
        message: "This user already exists",
      });
    }

    const img = await perfiles(req);
    const { imgUrl } = img;
    const { bannerUrl } = img;

    create = await new User({
      ...data,
      role: role?._id,
      img: imgUrl ? imgUrl : null,
      banner:bannerUrl? bannerUrl:null,
    });
    await create.save();

    res.status(201).send({
      ok: true,
      create,
      mensaje: "Usuario creado con éxito",
      message: "user created successfully",
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

const getUserByRol = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const role = await Roles.findOne({ code });

    const user = await User.find({ role: role?._id, isDeleted: false });

    res.status(200).send({
      ok: true,
      user,
      message: "Welcome",
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

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;
    const user: user= await User.findById(id)
    const img = await perfiles(req);
    const { imgUrl } = img;
    const { bannerUrl } = img;

    if(data.password){
      const encrypts = await encrypt(data.password);
      data.password = encrypts;
    }
  
    let banner;
    let profilePictur;

    if(user.banner==null){ banner=bannerUrl;}//si no hay banner en firebase
    else if(data.banner != user.banner ){deleteImage(user.banner); banner=bannerUrl;}//si hay banner en firebase
    else if(!data.banner && req.files['banner'] == null && user.banner!=null){deleteImage(user.banner); banner=null;}//si se queda sin banner
    else if(data.banner){banner=data.banner;}//dejar banner

    if(user.img==null){profilePictur=imgUrl;} //si no hay img en firebase
    else if(data.img != user.img ){deleteImage(user.img);profilePictur=imgUrl;}//si hay img en firebase
    else if(!data.img && req.files['img'] == null && user.img!=null){deleteImage(user.img);profilePictur=null; console.log("adios")}//si se queda sin img
    else if(data.img){profilePictur=data.img;}//dejar img

    const update: user | null = await User.findByIdAndUpdate(
      id,
      { ...data,img:profilePictur? profilePictur:null,
        banner:banner? banner:null,},
      { new: true }
    );

    res.status(200).send({
      ok: true,
      update,
      mensaje: "Usuario actualizado con exito",
      message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user: user | null = await User.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { new: true }
    );

    res.status(200).send({
      ok: true,
      user,
      mensaje: "Usuario eliminado con exito",
      message: "User deleted successfully",
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

const follow= async (req, res)=>
  {
    try
        {
         const {id}= req.params;
         const {...data}= req.body;
         const user= await User.findById(id);//usuario logeado
         const userToFollow= await User.findById(data.userToFollow);//la persona que quiero seguir
         if(!user.followed.includes(userToFollow._id))
            {
               await user.updateOne({$push:{followed:userToFollow._id}});
               await userToFollow.updateOne({$push:{followers: id}});
                res.status(200).json(
                {
                 ok: true,
                 mensaje: "empezaste a seguir a este usuario",
                 message: "you started following this user",
                });
            }
          else{
                res.status(403).json({
                ok: false,
                mensaje: "ya sigues a este usuario",
                message: "you already follow this user",
                    });
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
   
  }
    
 const unfollow= async (req, res)=>
    {
      try
          {
           const {id}= req.params;
           const {...data}= req.body;
           const user= await User.findById(id);//usuario logeado
           const userToFollow= await User.findById(data.userToUnFollow);//la persona que quiero dejar de seguir
           if(user.followed.includes(userToFollow._id))
              {
                 await user.updateOne({$pull:{followed:userToFollow._id}});
                 await userToFollow.updateOne({$pull:{followers:id}});
                  res.status(200).json(
                  {
                   ok: true,
                   mensaje: "dejaste a seguir a este usuario",
                   message: "you stopped following this user",
                  });
              }
            else{
                  res.status(403).json({
                  ok: false,
                  mensaje: "no sigues a este usuario",
                  message: "you don't  follow this user",
                      });
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
    
  } 
const getFollowersAndFollowed= async (req, res)=>
  {
    try
            {
             const {id}= req.body;
             const user= await User.findById(id);
             const followers= user.followers
             const followed= user.followed

                    res.status(200).json(
                    {
                     ok: true,
                     followers,followed,
                     mensaje: "seguidores y seguidos",
                     message: "followwers and followed",
                    });
            }catch (error) {
              console.log(error);
              res.status(500).json({
                ok: false,
                error,
                mensaje: "¡Ups! Algo salió mal",
                message: "Ups! Something went wrong",
              });
            }
      
      }

const getuser = async (req: Request, res: Response) => {
    try{
          const { userID } = req.params;
           const user= await User.findById(userID);

      
             res.status(200).send({
              ok: true,
              user,
              mensaje: "Post del usuario",
              message: "Post of the user",
            });  
        }
        catch (error) {
          res.status(500).json({
              ok: false,
              error,
              mensaje: "¡Ups! Algo salió mal",
              message: "Ups! Something went wrong",
          });
      }
      };

export { createUser, getUserByRol, updateUser, deleteUser, follow,unfollow, getFollowersAndFollowed, getuser};
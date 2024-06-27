import { Request, Response } from "express";
import User, { user } from "../model/user";
import Roles, { role } from "../model/role";
import Post, { post } from "../model/post";
import Community, { community } from "../model/community";
import Comments,{ comments } from "../model/comments";
import SubComments,{ subcomments } from "../model/subComments";
import { guardarImagenes } from "./uploadImage";
import { calculateElapsedTime } from "../helper/date";
import moment from "moment";

const createPost = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;

    const img = await guardarImagenes(req);

    const create: post = await new Post({
      ...data,
      img,
      postDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    await create.save();

    res.status(201).send({
      ok: true,
      post: create,
      mensaje: "Post creado con éxito",
      message: "post created successfully",
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

const getAllPostByCommunity = async (req: Request, res: Response) => {
  try {
    const { community_id } = req.params;
    const posts = await Post.find({ community_id }).populate("community");

    const mappedPosts = posts.map((item) => ({
      ...item,
      postDate: calculateElapsedTime(item.postDate),
    }));

    res.status(200).send({
      ok: true,
      posts,
      mensaje: "Posts encontrados correctamente",
      message: "Posts found successfully",
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

const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    const post: post | null = await Post.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );

    res.status(200).send({
      ok: true,
      post,
      mensaje: "Post actualizado con exito",
      message: "Post updated successfully",
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

const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post: post | null = await Post.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { new: true }
    );

    res.status(200).send({
      ok: true,
      post,
      mensaje: "Post eliminado con exito",
      message: "Post deleted successfully",
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

const timeLine= async (req, res)=>
  {
    try {
      const { _id } = req.params;
      const user = await User.findById(_id);
      const userCommunities = await Community.find({ members_id: _id });


      const friendsPosts = await Promise.all(
          user.followers.map((IDfriend) => {
              return Post.find({ userid: IDfriend });
          })
      );

      const communityPosts = await Promise.all(
          userCommunities.map((community) => {
              return Post.find({ community_id: community._id });
          })
      );
  
      // Combinar todas las publicaciones
      const allPosts = communityPosts.concat(...friendsPosts);

      res.status(200).json({
          ok: true,
          allPosts,
          mensaje: "Publicaciones de amigos y comunidades",
          message: "Posts of friends and communities",
      });
  } catch (error) {
      res.status(500).json({
          ok: false,
          error,
          mensaje: "¡Ups! Algo salió mal",
          message: "Ups! Something went wrong",
      });
  }
  
}
  

  const userProfile= async (req, res)=>
  {
      try{
        const { _id } = req.params;
         const user= await User.findById(_id);
         const {password, isActive, isDeleted, ...others}=user;
  
         const postUsuario= await Post.find({user_id:user._id});

           res.status(200).send({
            ok: true,
            others,postUsuario,
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
  }
  
  const comment= async (req, res)=>
  {
      try{
        const {...data}= req.body
          const newComment: comments = await new Comments({...data,})
          newComment.save();
          res.status(200).send({
            ok: true,
            newComment,
            mensaje: "comentario realizado",
            message: "comment done",
          });  
  
      }catch (error) {
        res.status(500).json({
        ok: false,
        error,
        mensaje: "¡Ups! Algo salió mal",
        message: "Ups! Something went wrong",
        });
  }
}
  
  const responseComment= async (req, res)=>
  {
    try{
      const {...data}= req.body
        const newComment: subcomments = await new SubComments({...data,})
        newComment.save();
        res.status(200).send({
          ok: true,
          newComment,
          mensaje: "comentario realizado",
          message: "comment done",
        });  

    }catch (error) {
      res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
      });
}
  }

  const like= async (req, res)=>
  {
    try
  {
    const {_id}= req.params
    const {...data}= req.body
    const post= await Post.findById(_id)
    if(!post.user_likes.includes(data.user))
      {
        await post.updateOne({$push:{user_likes: data.user}});
        res.status(200).send({
        ok: true,
        mensaje: "has dado like a esta publicacion",
        message: "you liked this post",
        });  
      }
    else{
        await post.updateOne({$pull:{user_likes:data.user}});
        res.status(200).send({
        ok: true,
        mensaje: "has quitado el like a esta publicacion",
        message: "has removed the like from this post",
        });
        }
  }catch (error) {
    res.status(500).json({
        ok: false,
        error,
        mensaje: "¡Ups! Algo salió mal",
        message: "Ups! Something went wrong",
    });
}
    
}
    

export { createPost, getAllPostByCommunity, updatePost, deletePost, timeLine, userProfile,comment,responseComment,like };

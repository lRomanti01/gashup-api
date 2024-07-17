import { Request, Response } from "express";
import User, { user } from "../model/user";
import Roles, { role } from "../model/role";
import Post, { post } from "../model/post";
import Community, { community } from "../model/community";
import Comments, { comments } from "../model/comments";
import SubComments, { subcomments } from "../model/subComments";
import { guardarImagenes } from "./uploadImage";
import { calculateElapsedTime } from "../helper/date";
import moment from "moment";

const createPost = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;

    const img = await guardarImagenes(req);

    const create: post = await new Post({
      ...data,
      images: img.imgUrls,
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
    const { community } = req.params;
    const posts = await Post.find({ community })
      .populate("community")
      .populate("user")
      .sort({ postDate: -1 });

    const mappedPosts = await Promise.all(
      posts.map(async (item) => {
        const comments = await Comments.find({ post_id: item._id });
        return {
          ...item.toObject(), // Convert Mongoose document to plain JavaScript object
          postDate: calculateElapsedTime(item.postDate),
          comments,
        };
      })
    );

    res.status(200).send({
      ok: true,
      data: mappedPosts,
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

const getPostById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const post = await Post.findById(_id)
      .populate("community")
      .populate("user");

    if (!post) {
      return res.status(404).send({
        ok: false,
        mensaje: "Post no encontrado",
        message: "Post not found",
      });
    }

    const postObj = post.toObject();
    postObj.postDate = calculateElapsedTime(postObj.postDate);

    const comments = await Comments.find({ post_id: _id });

    res.status(200).send({
      ok: true,
      data: { ...postObj, comments },
      mensaje: "Post encontrado correctamente",
      message: "Post found successfully",
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

const timeLine = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id);
    const userCommunities = await Community.find({ members_id: _id });
    const userCommunityIds = userCommunities.map((community) => community._id);

    const friendsPosts = await Promise.all(
      user.followers.map((IDfriend) => {
        return Post.find({ userid: IDfriend, isActive: true });
      })
    );

    const communityPosts = await Promise.all(
      userCommunities.map((community) => {
        return Post.find({ community_id: community._id, isActive: true });
      })
    );

    const nonUserCommunityPosts = await Post.find({
      community_id: { $nin: userCommunityIds },
      isActive: true,
    });

    // Combinar todas las publicaciones
    const allPosts = [
      ...communityPosts.flat(),
      ...friendsPosts.flat(),
      ...nonUserCommunityPosts,
    ];

    // Función para calcular la puntuación de cada publicación
    const calculateHotScore = (post) => {
      const likes = post.user_likes.length || 0;
      const ageInHours =
        (Date.now() - new Date(post.createdAt).getTime()) / 36e5; // 36e5 es 3600000, que es el número de milisegundos en una hora
      return likes / (ageInHours + 2);
    };

    // Calcular la puntuación de "Hot" para cada publicación
    allPosts.forEach((post) => {
      post.hotScore = calculateHotScore(post);
    });

    // Ordenar las publicaciones por la puntuación de "Hot"
    allPosts.sort((a, b) => b.hotScore - a.hotScore);

    // Separar publicaciones
    const userCommunityPosts = allPosts.filter((post) =>
      userCommunityIds.includes(post.community)
    );
    const friendsPostsOnly = allPosts.filter((post) =>
      user.followers.includes(String(post.user))
    );
    const otherCommunityPosts = allPosts.filter(
      (post) =>
        !userCommunityIds.includes(post.community) &&
        !user.followers.includes(String(post.user))
    );

    // Crear el feed combinado
    const combinedFeed = [];
    let userCommunityIndex = 0;
    let friendsIndex = 0;
    let otherCommunityIndex = 0;

    while (
      userCommunityIndex < userCommunityPosts.length ||
      friendsIndex < friendsPostsOnly.length ||
      otherCommunityIndex < otherCommunityPosts.length
    ) {
      // Agregar 2 posts de las comunidades del usuario
      for (
        let i = 0;
        i < 2 && userCommunityIndex < userCommunityPosts.length;
        i++
      ) {
        combinedFeed.push(userCommunityPosts[userCommunityIndex++]);
      }

      // Agregar 4 posts de otras comunidades
      for (
        let i = 0;
        i < 4 && otherCommunityIndex < otherCommunityPosts.length;
        i++
      ) {
        combinedFeed.push(otherCommunityPosts[otherCommunityIndex++]);
      }

      // Agregar 2 posts de amigos
      for (let i = 0; i < 2 && friendsIndex < friendsPostsOnly.length; i++) {
        combinedFeed.push(friendsPostsOnly[friendsIndex++]);
      }

      // Agregar 4 posts de otras comunidades
      for (
        let i = 0;
        i < 4 && otherCommunityIndex < otherCommunityPosts.length;
        i++
      ) {
        combinedFeed.push(otherCommunityPosts[otherCommunityIndex++]);
      }
    }

    res.status(200).json({
      ok: true,
      orden: combinedFeed,
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
};

const userProfile = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id);
    const { password, isActive, isDeleted, ...others } = user;

    const postUsuario = await Post.find({ user_id: user._id });

    res.status(200).send({
      ok: true,
      others,
      postUsuario,
      mensaje: "Post del usuario",
      message: "Post of the user",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const comment = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const newComment: comments = await new Comments({
      ...data,
      commentDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    await newComment.save();
    await newComment.populate("user_id");

    const comment = {
      ...newComment.toObject(), 
      commentDate: calculateElapsedTime(newComment.commentDate),
    };

    res.status(200).send({
      ok: true,
      data: comment,
      mensaje: "comentario realizado",
      message: "comment done",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const comment = await Comments.find({ post_id: _id })
      .populate("user_id")
      .sort({ commentDate: -1 });

    const mappedComments = comment.map((item) => ({
      ...item.toObject(), // Convert Mongoose document to plain JavaScript object
      commentDate: calculateElapsedTime(item.commentDate),
    }));

    res.status(200).send({
      ok: true,
      data: mappedComments,
      mensaje: "Comentarios encontrados correctamente",
      message: "Comments found successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    await Comments.findByIdAndDelete(commentId);
    res.status(200).send({
      ok: true,
      mensaje: "Comentario borrado",
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { ...data } = req.body;

    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        ok: false,
        mensaje: "Comentario no encontrado",
        message: "Comment not found",
      });
    }

    const now = new Date();
    const commentCreatedAt = new Date(comment.createdAt);
    const timeDiff = Math.abs(now.getTime() - commentCreatedAt.getTime());
    const minutesDiff = Math.floor(timeDiff / 1000 / 60);

    if (minutesDiff > 25) {
      return res.status(403).json({
        ok: false,
        mensaje: "El comentario no se puede actualizar después de 25 minutos",
        message: "The comment cannot be updated after 25 minutes",
      });
    }

    Object.assign(comment, data);
    await comment.save();

    res.status(200).send({
      ok: true,
      updatedComment: comment,
      mensaje: "Comentario actualizado",
      message: "Comment updated",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const responseComment = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const newComment: subcomments = await new SubComments({ ...data });
    newComment.save();
    res.status(200).send({
      ok: true,
      data: newComment,
      mensaje: "comentario realizado",
      message: "comment done",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const deleteResponseComment = async (req: Request, res: Response) => {
  try {
    const { responseCommentId } = req.params;
    await SubComments.findByIdAndDelete(responseCommentId);
    res.status(200).send({
      ok: true,
      mensaje: "Respuesta de comentario borrada",
      message: "Response comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const updateResponseComment = async (req: Request, res: Response) => {
  try {
    const { responseCommentId } = req.params;
    const { ...data } = req.body;

    const subComment = await SubComments.findById(responseCommentId);
    if (!subComment) {
      return res.status(404).json({
        ok: false,
        mensaje: "Respuesta de comentario no encontrada",
        message: "Response comment not found",
      });
    }

    const now = new Date();
    const commentCreatedAt = new Date(subComment.createdAt);
    const timeDiff = Math.abs(now.getTime() - commentCreatedAt.getTime());
    const minutesDiff = Math.floor(timeDiff / 1000 / 60);

    if (minutesDiff > 25) {
      return res.status(403).json({
        ok: false,
        mensaje: "La respuesta de comentario no se puede actualizar después de 25 minutos",
        message: "The response comment cannot be updated after 25 minutes",
      });
    }

    Object.assign(subComment, data);
    await subComment.save();

    res.status(200).send({
      ok: true,
      updatedResponseComment: subComment,
      mensaje: "Respuesta de comentario actualizada",
      message: "Response comment updated",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const likePost = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { ...data } = req.body;
    const post = await Post.findById(_id);
    if (!post.user_likes.includes(data.user)) {
      await post.updateOne({ $push: { user_likes: data.user } });
      res.status(200).send({
        ok: true,
        data: true,
        mensaje: "has dado like a esta publicacion",
        message: "you liked this post",
      });
    } else {
      await post.updateOne({ $pull: { user_likes: data.user } });
      res.status(200).send({
        ok: true,
        data: false,
        mensaje: "has quitado el like a esta publicacion",
        message: "has removed the like from this post",
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

export {
  createPost,
  getAllPostByCommunity,
  updatePost,
  deletePost,
  timeLine,
  userProfile,
  comment,
  responseComment,
  likePost,
  getPostById,
  getCommentsByPost,
  deleteComment,
  updateComment,
  deleteResponseComment,
  updateResponseComment,
};

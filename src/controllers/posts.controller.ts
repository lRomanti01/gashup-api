import { Request, Response } from "express";
import User, { user } from "../model/user";
import Roles, { role } from "../model/role";
import Post, { post } from "../model/post"; // Importa la interfaz junto con el modelo
import Community, { community } from "../model/community";
import Comments, { comments } from "../model/comments";
import SubComments, { subcomments } from "../model/subComments";
import { guardarImagenes } from "./uploadImage";
import { calculateElapsedTime } from "../helper/date";
import moment from "moment";
import subComments from "../model/subComments";

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
    const posts = await Post.find({
      community,
      isActive: true,
      isDeleted: false,
    })
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

    // Get community
    let communityQuery: any = Community.findById(post.community._id).populate(
      "owner_id"
    );
    const communityCheck = await Community.findById(post.community._id).lean();

    //  Verify if admins exist
    if (communityCheck?.admins_id?.length > 0) {
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

    const postObj = post.toObject();
    postObj.postDate = calculateElapsedTime(postObj.postDate);

    const comments = await Comments.find({ post_id: _id });

    res.status(200).send({
      ok: true,
      data: { ...postObj, comments, community },
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
    const { _id } = req.params;
    const { ...data } = req.body;

    const post: post | null = await Post.findByIdAndUpdate(
      _id,
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
    const { _id } = req.params;

    const post: post | null = await Post.findByIdAndUpdate(
      _id,
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

const timeLine = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;

    // Función para calcular la puntuación de cada publicación
    function calculateHotScore(post) {
      const likes = post.user_likes.length || 0;
      const ageInHours =
        (Date.now() - new Date(post.postDate).getTime()) / 36e5; // 36e5 es 3600000, que es el número de milisegundos en una hora
      return likes / (ageInHours + 2);
    }

    const POST = Post.find({ isActive: true });
    for (const post of await POST) {
      post.hotScore = calculateHotScore(post);
      await post.updateOne({ hotScore: post.hotScore }); // Guardar solo hotScore en la base de datos
    }

    let allPosts = [];
    if (_id != null) {
      const user = await User.findById(_id);

      if (!user) {
        return res.status(404).json({
          ok: false,
          mensaje: "Usuario no encontrado",
          message: "User not found",
        });
      }

      // Obtener comunidades del usuario y comunidades en las que está baneado
      const userCommunities = await Community.find({ members_id: user._id });
      const bannedCommunities = await Community.find({
        bannedUsers_id: user._id,
      });

      const userCommunityIds = userCommunities.map((community) =>
        community._id.toString()
      );
      const bannedCommunityIds = bannedCommunities.map((community) =>
        community._id.toString()
      );

      const friendsPosts = await Promise.all(
        user.followers.map((IDfriend) =>
          Post.find({ user: IDfriend, isActive: true })
            .populate("community")
            .populate("user")
        )
      );
      const userId = user._id;
      const communityPosts = await Promise.all(
        userCommunityIds.map((communityID) =>
          Post.find({
            community: communityID,
            isActive: true,
            user: { $nin: [userId] },
          })
            .populate("community")
            .populate("user")
        )
      );

      const nonUserCommunityPosts = await Post.find({
        community: { $nin: [...userCommunityIds, ...bannedCommunityIds] },
        isActive: true,
        user: { $nin: [...user.followers, user._id] },
      })
        .populate("community")
        .populate("user");

      // Comentarios
      const friendsCommentsCount = await Comments.aggregate([
        {
          $match: {
            post_id: { $in: friendsPosts.flat().map((post) => post._id) },
          },
        },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]);
      const noCommunityCommentsCount = await Comments.aggregate([
        {
          $match: {
            post_id: { $in: nonUserCommunityPosts.map((post) => post._id) },
          },
        },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]);
      const communityCommentsCount = await Comments.aggregate([
        {
          $match: {
            post_id: { $in: communityPosts.flat().map((post) => post._id) },
          },
        },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]);

      // Agrupar comentarios por post_id
      const commentCountByPostId = (comments) =>
        comments.reduce((acc, { _id, count }) => {
          acc[_id.toString()] = count || 0;
          return acc;
        }, {} as { [key: string]: number });

      const commentCountByPostIdFriends =
        commentCountByPostId(friendsCommentsCount);
      const commentCountByPostIdNoCommunity = commentCountByPostId(
        noCommunityCommentsCount
      );
      const commentCountByPostIdCommunity = commentCountByPostId(
        communityCommentsCount
      );

      // Agrupar publicaciones por post_id e incluir conteo de comentarios
      const postsWithCommentCounts = (posts, commentCounts) =>
        posts.map((post) => ({
          ...post.toObject(),
          commentCount: commentCounts[post._id.toString()] || 0,
        }));

      allPosts = [
        ...communityPosts.flat(),
        ...friendsPosts.flat(),
        ...nonUserCommunityPosts,
      ];

      // Ordenar las publicaciones por la puntuación de "Hot"
      allPosts.sort((a, b) => b.hotScore - a.hotScore);
      for (const post of allPosts) {
        post.postDate = calculateElapsedTime(post.postDate); // Calcular el tiempo transcurrido para cada publicación sin guardarlo en la base de datos
      }

      // Separar publicaciones
      const userCommunityPosts = postsWithCommentCounts(
        allPosts.filter((post) =>
          userCommunityIds.includes(String(post.community._id))
        ),
        commentCountByPostIdCommunity
      );

      const friendsPostsOnly = postsWithCommentCounts(
        allPosts.filter((post) =>
          user.followers.includes(String(post.user._id))
        ),
        commentCountByPostIdFriends
      );

      const otherCommunityPosts = postsWithCommentCounts(
        allPosts.filter(
          (post) =>
            !userCommunityIds.includes(String(post.community._id)) &&
            !bannedCommunityIds.includes(String(post.community._id)) &&
            !user.followers.includes(String(post.user._id))
        ),
        commentCountByPostIdNoCommunity
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
        data: [...combinedFeed],
        mensaje: "Publicaciones de amigos y comunidades",
        message: "Posts of friends and communities",
      });
    } else {
      // Si el ID del usuario es null, obtener todos los posts y organizar el conteo de comentarios
      allPosts = await Post.find({ isActive: true })
        .populate("community")
        .populate("user");

      // Obtener todos los IDs de los posts
      const allPostIds = allPosts.map((post) => post._id);

      // Contar los comentarios para cada post
      const allCommentsCount = await Comments.aggregate([
        { $match: { post_id: { $in: allPostIds } } },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]);

      // Crear un mapa para acceder rápidamente a la cantidad de comentarios por post_id
      const allCommentsCountMap = allCommentsCount.reduce(
        (acc, { _id, count }) => {
          acc[_id.toString()] = count;
          return acc;
        },
        {} as { [key: string]: number }
      );

      // Agregar la cantidad de comentarios a cada post después de obtener todos los posts
      const postsWithCommentCount = allPosts.map((post) => ({
        ...post.toObject(),
        commentCount: allCommentsCountMap[post._id.toString()] || 0,
      }));

      // Calcular el tiempo transcurrido para cada publicación sin guardarlo en la base de datos
      for (const post of postsWithCommentCount) {
        post.postDate = calculateElapsedTime(post.postDate);
      }

      // Fisher-Yates shuffle algorithm para mezclar los posts aleatoriamente
      for (let i = postsWithCommentCount.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [postsWithCommentCount[i], postsWithCommentCount[j]] = [
          postsWithCommentCount[j],
          postsWithCommentCount[i],
        ];
      }

      res.status(200).json({
        ok: true,
        data: postsWithCommentCount,
        mensaje: "Publicaciones aleatorias con conteo de comentarios",
        message: "Random posts with comment count",
      });
    }
  } catch (error) {
    console.error(error); // Log the detailed error
    res.status(500).json({
      ok: false,
      error: error.message,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const userProfile = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).send({
        ok: false,
        mensaje: "Usuario no encontrado",
        message: "User not found",
      });
    }

    // Obtén los posts del usuario
    const postUsuario = await Post.find({ user: user._id })
      .populate("user")
      .populate("community");
    // Obtén los comentarios para los posts del usuario
    const comments = await Comments.find({
      post_id: { $in: postUsuario.map((post) => post._id) },
    });

    // Obtén los subcomentarios para los comentarios
    const commentIds = comments.map((comment) => comment._id);
    const subcomments = await SubComments.find({
      comment_id: { $in: commentIds },
    });

    // Agrupa los subcomentarios por comment_id usando strings como claves
    const subcommentsGroupedByComment = subcomments.reduce(
      (acc, subcomment) => {
        const commentIdStr = subcomment.comment_id.toString(); // Convertir ObjectId a string
        if (!acc[commentIdStr]) {
          acc[commentIdStr] = [];
        }
        acc[commentIdStr].push(subcomment);
        return acc;
      },
      {} as { [key: string]: subcomments[] }
    );

    // Agrupa los comentarios por post_id e incluye los subcomentarios en cada comentario
    const postsWithCommentsAndSubcomments = postUsuario.map((post) => ({
      ...post.toObject(),
      postDate: calculateElapsedTime(post.postDate),
      comments: comments
        .filter((comment) => comment.post_id.equals(post._id))
        .map((comment) => ({
          ...comment.toObject(),
          subcomments:
            subcommentsGroupedByComment[comment._id.toString()] || [],
        })),
    }));

    res.status(200).send({
      ok: true,
      user: user,
      posts: postsWithCommentsAndSubcomments,
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
    const comments = await Comments.find({ post_id: _id })
      .populate("user_id")
      .sort({ commentDate: -1 });

    // Convert Mongoose documents to plain JavaScript objects and map subcomments
    const mappedComments = await Promise.all(
      comments.map(async (comment) => {
        const subComments = await SubComments.find({ comment_id: comment._id })
          .populate("user_id")
          .sort({ commentDate: -1 });

        const mappedSubComments = subComments.map((subComment) => ({
          ...subComment.toObject(),
          commentDate: calculateElapsedTime(subComment.commentDate),
        }));

        return {
          ...comment.toObject(),
          commentDate: calculateElapsedTime(comment.commentDate),
          subComments: mappedSubComments,
        };
      })
    );

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

    const comment = await Comments.findById(commentId).populate("user_id");
    if (!comment) {
      return res.status(404).json({
        ok: false,
        mensaje: "Comentario no encontrado",
        message: "Comment not found",
      });
    }

    const now = new Date();
    const commentCreatedAt = new Date(comment.commentDate);
    const timeDiff = Math.abs(now.getTime() - commentCreatedAt.getTime());
    const minutesDiff = Math.floor(timeDiff / 60000);

    if (minutesDiff > 1440) {
      return res.status(403).json({
        ok: false,
        mensaje: "El comentario no se puede actualizar después de un dia",
        message: "The comment cannot be updated after one day",
      });
    }

    Object.assign(comment, data);
    await comment.save();

    const newComment = {
      ...comment.toObject(),
      commentDate: calculateElapsedTime(comment.commentDate),
    };

    res.status(200).send({
      ok: true,
      data: newComment,
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
    const newComment: subcomments = await new SubComments({
      ...data,
      commentDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    }).populate("user_id");
    await newComment.save();

    const comment = {
      ...newComment.toObject(),
      commentDate: calculateElapsedTime(newComment.commentDate),
    };
    res.status(200).send({
      ok: true,
      data: comment,
      mensaje: "Comentario realizado",
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

const getSubCommentsByComment = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const comment = await SubComments.find({ comment_id: _id })
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

    const subComment = await SubComments.findById(responseCommentId).populate(
      "user_id"
    );
    console.log(subComment);
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

    if (minutesDiff > 1440) {
      return res.status(403).json({
        ok: false,
        mensaje:
          "La respuesta de comentario no se puede actualizar después de un dia",
        message: "The response comment cannot be updated after one day",
      });
    }

    Object.assign(subComment, data);
    await subComment.save();

    res.status(200).send({
      ok: true,
      data: subComment,
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
      await post.updateOne({ _id }, { $push: { user_likes: data.user } });
      res.status(200).send({
        ok: true,
        data: true,
        mensaje: "has dado like a esta publicacion",
        message: "you liked this post",
      });
    } else {
      await post.updateOne({ _id }, { $pull: { user_likes: data.user } });
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

const likeComment = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { user } = req.body;

    // Buscar el comentario por ID
    const comment = await Comments.findById(_id);

    if (!comment) {
      return res.status(404).json({
        ok: false,
        mensaje: "Comentario no encontrado",
        message: "Comment not found",
      });
    }

    // Verificar si el usuario ya dio like al comentario
    if (!comment.user_likes.includes(user)) {
      // Agregar el usuario a los likes del comentario
      await Comments.updateOne({ _id }, { $push: { user_likes: user } });
      const newComment = await Comments.findById(_id).populate("user_id");
      res.status(200).send({
        ok: true,
        data: true,
        comment: newComment,
        mensaje: "Has dado like a este comentario",
        message: "You liked this comment",
      });
    } else {
      // Remover el usuario de los likes del comentario
      await Comments.updateOne({ _id }, { $pull: { user_likes: user } });
      const newComment = await Comments.findById(_id).populate("user_id");
      res.status(200).send({
        ok: true,
        data: false,
        comment: newComment,
        mensaje: "Has quitado el like a este comentario",
        message: "You removed the like from this comment",
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Oops! Something went wrong",
    });
  }
};


const popularPost = async (req: Request, res: Response) => {
  try {
    // Obtener todos los posts activos
    const posts = await Post.find({ isActive: true })
      .populate("community")
      .populate("user");

    // Obtener los IDs de los posts
    const postIds = posts.map((post) => post._id);

    // Contar los comentarios para cada post
    const commentsCount = await Comments.aggregate([
      { $match: { post_id: { $in: postIds } } },
      { $group: { _id: "$post_id", count: { $sum: 1 } } },
    ]);

    // Crear un mapa para acceder rápidamente a la cantidad de comentarios por post_id
    const commentsCountMap = commentsCount.reduce((acc, { _id, count }) => {
      acc[_id.toString()] = count;
      return acc;
    }, {} as { [key: string]: number });

    // Ordenar los posts por número de likes en orden descendente
    const sortedPosts = posts.sort(
      (a, b) => b.user_likes.length - a.user_likes.length
    );
    for (const post of sortedPosts) {
      post.postDate = calculateElapsedTime(post.postDate);  
    }

    // Agregar la cantidad de comentarios a cada post después de ordenarlos
    const postsWithCommentCount = sortedPosts.map((post) => ({
      ...post.toObject(),
      commentCount: commentsCountMap[post._id.toString()] || 0,
    }));



    res.status(200).json({
      ok: true,
      data: postsWithCommentCount,
      mensaje:
        "Publicaciones ordenadas por número de likes y con conteo de comentarios",
      message: "Posts sorted by number of likes with comment count",
    });
  } catch (error) {
    console.error(error); // Log the detailed error
    res.status(500).json({
      ok: false,
      error: error.message,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

const likeSubComment = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { user } = req.body;

    const comment = await subComments.findById(_id);
    if (!comment) {
      return res.status(404).json({
        ok: false,
        mensaje: "Comentario no encontrado",
        message: "Comment not found",
      });
    }

    if (!comment.user_likes.includes(user)) {
      await subComments.updateOne({ _id }, { $push: { user_likes: user } });
      const updatedComment = await subComments.findById(_id).populate("user_id");
      return res.status(200).json({
        ok: true,
        data: true,
        comment: updatedComment,
        mensaje: "Has dado like a este comentario",
        message: "You liked this comment",
      });
    } else {
      await subComments.updateOne({ _id }, { $pull: { user_likes: user } });
      const updatedComment = await subComments
        .findById(_id)
        .populate("user_id");
      return res.status(200).json({
        ok: true,
        data: false,
        comment: updatedComment,
        mensaje: "Has quitado el like a este comentario",
        message: "You removed the like from this comment",
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Oops! Something went wrong",
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
  getSubCommentsByComment,
  likeComment,
  likeSubComment,
  deleteComment,
  updateComment,
  deleteResponseComment,
  updateResponseComment,
  popularPost,
};

import { Request, Response } from "express";
import User, { user } from "../model/user";
import Roles, { role } from "../model/role";
import Post, { post } from "../model/post";
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

    const mappedPosts = posts.map((item) => ({
      ...item.toObject(), // Convert Mongoose document to plain JavaScript object
      postDate: calculateElapsedTime(item.postDate),
    }));

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

export { createPost, getAllPostByCommunity, updatePost, deletePost };

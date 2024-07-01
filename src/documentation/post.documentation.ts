
/**  POST Methods */
/** createPost
 * @openapi
 * '/api/post/createPost':
 *  post:
 *     tags:
 *     - Post
 *     summary: crear una publicacion
 *     requestBody:
 *      required: true
 *      content:
 *         multipart/form-data:
 *           schema:
 *            type: object
 *            required:
 *              - title
 *              - description
 *              - community
 *              - user_id
 *              - img
 *            properties:
 *              typePost_id:
 *                type: string
 *                default: ''
 *              title:
 *                type: string
 *                default: ''
 *              description:
 *                type: string
 *                default: ''
 *              community:
 *                type: string
 *                default: ''
 *              user_id:
 *                type: string
 *                default: ''
 *              code:
 *                type: string
 *                default: ''
 *              img:
 *                type: array
 *                items:
 *                 type: string
 *                 format: binary
 *     responses:
 *      201:
 *        description: post creado
 *      500:
 *         description: server err
 */
    
/** comment
 * @openapi
 * '/api/post/comment':
 *  post:
 *     tags:
 *     - Post
 *     summary: comentar publicaccion
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - description
 *              - user_id
 *              - post_id
 *            properties:
 *              description:
 *                type: string
 *                default: ''
 *              user_id:
 *                type: string
 *                default: ''
 *              post_id:
 *                type: string
 *                default: ''
 *     responses:
 *      201:
 *        description: publicacion comentada
 *      500:
 *         description: server err
 */

/** responseComment
 * @openapi
 * '/api/post/responseComment':
 *  post:
 *     tags:
 *     - Post
 *     summary: responder un comentario
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - description
 *              - user_id
 *              - comment_id
 *            properties:
 *              description:
 *                type: string
 *                default: ''
 *              user_id:
 *                type: string
 *                default: ''
 *              comment_id:
 *                type: string
 *                default: ''
 *     responses:
 *      201:
 *        description: comentario respondido
 *      500:
 *         description: server err
 */

/**  PUT Methods */
/** updatePost
 * @openapi
 * '/api/post/updatePost/:id':
 *  put:
 *     tags:
 *     - Post
 *     summary: actualizar una publicacion
 *     requestBody:
 *      required: true
 *      content:
 *         multipart/form-data:
 *           schema:
 *            type: object
 *            required:
 *              - title
 *              - description
 *              - img
 *            properties:
 *              typePost_id:
 *                type: string
 *                default: ''
 *              title:
 *                type: string
 *                default: ''
 *              description:
 *                type: string
 *                default: ''
 *              img:
 *                type: array
 *                items:
 *                 type: string
 *                 format: binary
 *     responses:
 *      201:
 *        description: post actualizado
 *      500:
 *         description: server err
 */

/** like
 * @openapi
 * '/api/post/like/:_id':
 *  put:
 *     tags:
 *     - Post
 *     summary: dar o quitar like a una publicacion
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: ID del post 
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userID
 *            properties:
 *              userID:
 *                type: string
 *                default: ''
 *     responses:
 *      201:
 *        description: like colocado
 *      500:
 *         description: server err
 */

/**  DELETE Methods */
/** deletePost
 * @openapi
 * '/api/post/deletePost/:id':
 *  delete:
 *     tags:
 *     - Post
 *     summary: borrar una publicacion
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del post
 *     responses:
 *      200:
 *        description: post eliminado
 *      500:
 *         description: server err
 */

/**  GET Methods */
/** userProfile
 * @openapi
 * '/api/post/userProfile/_id':
 *  get:
 *     tags:
 *     - Post
 *     summary: obtener publicaciones de un usuario
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: ID del usuario 
 *     responses:
 *      201:
 *        description: publicaciones de un usuario
 *      500:
 *         description: server err
 */

/** getAllPostByCommunity
 * @openapi
 * '/api/post/getAllPostByCommunity/:community':
 *  get:
 *     tags:
 *     - Post
 *     summary: todos los post de una comunidad 
 *     parameters:
 *       - name: community
 *         in: path
 *         required: true
 *         description: ID de la comunidad 
 *     responses:
 *      201:
 *        description: publicaciones de la comunidad 
 *      500:
 *         description: server err
     */

/** timeLine
 * @openapi
 * '/api/post/timeLine/_id':
 *  get:
 *     tags:
 *     - Post
 *     summary: post del home
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: ID del usuario 
 *     responses:
 *      201:
 *        description: post para el home
 *      500:
 *         description: server err
 */
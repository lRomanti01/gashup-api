/** POST Methods */
/** createCommunity
 * @openapi
 * '/api/community/createCommunity':
 *  post:
 *     tags:
 *     - Community
 *     summary: crear una comunidad
 *     requestBody:
 *      required: true
 *      content:
 *         multipart/form-data:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - owner_id
 *              - description
 *              - img
 *              - banner
 *              - communityCategory_id
 *            properties:
 *              name:
 *                type: string
 *                default: ''
 *              owner_id:
 *                type: string
 *                default: ''
 *              description:
 *                type: string
 *                default: ''
 *              img:
 *                type: string
 *                format: binary
 *              banner:
 *                type: string
 *                format: binary
 *              communityCategory_id:
 *                type: array
 *                items:
 *                  type: string
 *                default: []
 *     responses:
 *      201:
 *        description: se creo la comunidad correctamente
 *      404:
 *        description: usuario o comunidad no encontrados
 *      500:
 *         description: server error
 */

/** createChatCommunity
 * @openapi
 * /api/community/createChatCommunity:
 *   post:
 *     tags:
 *       - Community
 *     summary: crear un chat en la comunidad
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - chatOwner_id
 *               - community_id
 *               - img
 *             properties:
 *               name:
 *                 type: string
 *                 default: ''
 *               chatOwner_id:
 *                 type: ObjectId
 *                 default: ''
 *               community_id:
 *                 type: ObjectId
 *                 default: ''
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: se creo el chat para la comunidad correctamente
 *       500:
 *         description: server error
 */

/** joinChatCommunity
 * @openapi
 * /api/community/joinChatCommunity/{_id}:
 *   post:
 *     tags:
 *       - Community
 *     summary: unirse a un chat en la comunidad
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: ID de la comunidad 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatID
 *               - userID
 *             properties:
 *               chatID:
 *                 type: ObjectId
 *                 default: ''
 *               userID:
 *                 type: ObjectId
 *                 default: ''
 *     responses:
 *       201:
 *         description: se creo el chat para la comunidad correctamente
 *       400:
 *         description: no perteneces a la comunidad
 *       500:
 *         description: server err
 */

/** joinCommunity
 * @openapi
 * '/api/community/joinCommunity/{_id}':
 *   post:
 *     tags:
 *       - Community
 *     summary: unirse a una comunidad
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la comunidad 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberID
 *             properties:
 *               memberID:
 *                 type: ObjectId
 *                 default: ''
 *     responses:
 *       201:
 *         description: se creo el chat para la comunidad correctamente
 *       500:
 *         description: server err
 */

/** PUT Methods */
/** updateCommunity
    * @openapi
    * '/api/community/updateCommunity/{_id}':
    *   put:
    *     tags:
    *       - Community
    *     summary: actualizar datos de una comunidad
    *     parameters:
    *       - name: id
    *         in: path
    *         required: true
    *         description: ID de la comunidad a actualizar
    *         schema:
    *           type: string
    *     requestBody:
    *       required: true
    *       content:
    *         multipart/form-data:
    *           schema:
    *             type: object
    *             required:
    *               - name
    *               - userID
    *               - description
    *               - img
    *               - communityCategory_id
    *             properties:
    *               name:
    *                 type: string
    *               userID:
    *                 type: string
    *               description:
    *                 type: string
    *               img:
    *                 type: string
    *                 format: binary
    *               communityCategory_id:
    *                 type: array
    *                 items:
    *                   type: string
    *     responses:
    *       201:
    *         description: se actualizó la comunidad correctamente
    *       500:
    *         description: error del servidor
    */

/** assignAdmins
     * @openapi
     * '/api/community/assignAdmins/{_id}':
     *  put:
     *     tags:
     *     - Community
     *     summary: asignar admins a la comunidad
     *     parameters:
     *     - name: _id
     *       in: path
     *       required: true
     *       description: ID de la comunidad a la que se le asignaran los admins
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - ownerID
     *              - adminID
     *            properties:
     *              ownerID:
     *                type: ObjectId
     *                default: ''
     *              adminID:
     *                type: ObjectId
     *                default: ''
     *     responses:
     *      200:
     *        description: se asignaron los admins la comunidad correctamente
     *      400:
     *        description: Solo el dueño puede asignar admins
     *      500:
     *         description: server err
     */

/** updateCommunityChat
 * @openapi
 * '/api/community/updateCommunityChat/{_id}':
 *   put:
 *     tags:
 *       - Community
 *     summary: asignar admins a la comunidad
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del chat
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - img
 *             properties:
 *               name:
 *                 type: string
 *                 default: ''
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: se asignaron los admins la comunidad correctamente
 *       404:
 *         description: chat no encontrado
 *       500:
 *         description: error del servidor
 */

/** DELETE Methods */
/** deleteCommunity
     * @openapi
     * '/api/community/deleteCommunity/{_id}':
     *  delete:
     *     tags:
     *     - Community
     *     summary: eliminar una comunidad
     *     parameters:
     *     - name: _id
     *       in: path
     *       required: true
     *       description: ID de la comunidad a eliminar
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - ownerID
     *            properties:
     *              ownerID:
     *                type: ObjectId
     *                default: ''

     *     responses:
     *      201:
     *        description: se elimino la comunidad correctamente
     *      400:
     *         description: Solo el dueño puede borarr la comunidad
     *      404:
     *        description: no se encontro la comunidad
     *      500:
     *         description: server err
     */

/** banFromCommunity
     * @openapi
     * '/api/community/banFromCommunity/{_id}':
     *  delete:
     *     tags:
     *     - Community
     *     summary: banear un usuario de una comunidad
     *     parameters:
     *     - name: _id
     *       in: path
     *       required: true
     *       description: ID de la comunidad en la cual se baneara al usuario
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - userID
     *              - bannedID:
     *            properties:
     *              userID:
     *                type: ObjectId
     *                default: ''
     *              bannedID:
     *                type: ObjectId
     *                default: ''

     *     responses:
     *      200:
     *        description: se baneo al usuario de la comunidad correctamente
     *      400:
     *        description: Solamente dueños y admins banean personas de las comunidades
     *      500:
     *         description: server err
     */

/** leaveCommunity
     * @openapi
     * '/api/community/leaveCommunity/{_id}':
     *  delete:
     *     tags:
     *     - Community
     *     summary: dejar una comunidad de una comunidad
     *     parameters:
     *     - name: _id
     *       in: path
     *       required: true
     *       description: ID de la comunidad
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
     *                type: ObjectId
     *                default: ''
     *     responses:
     *      201:
     *        description: se abandono la comunidad correctamente
     *      500:
     *         description: server err
     */
    
/** leaveChatCommunity
     * @openapi
     * '/api/community/leaveChatCommunity/{_id}':
     *  delete:
     *     tags:
     *     - Community
     *     summary: dejar un chat de una comunidad
     *     parameters:
     *     - name: _id
     *       in: path
     *       required: true
     *       description: ID del chat
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
     *                type: ObjectId
     *                default: ''
     *     responses:
     *      201:
     *        description: se abandono el chat correctamente
     *      500:
     *         description: server err
     */
    
/** deleteCommunityChat
     * @openapi
     * '/api/community/deleteCommunityChat/{_id}':
     *  delete:
     *     tags:
     *     - Community
     *     summary: eliminar un chat
     *     parameters:
     *     - name: _id
     *       in: path
     *       required: true
     *       description: ID del chat
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - ownerID
     *            properties:
     *              ownerID:
     *                type: ObjectId
     *                default: ''
     *     responses:
     *      201:
     *        description: se elimino el chat correctamente
     *      400:
     *         description: Solo el dueño puede borarr el chat
     *      404:
     *        description: no se encontro el chat
     *      500:
     *         description: server err
     */

/** GET Methods */
/** getCommunity
     * @openapi
     * '/api/community/getCommunity/{_id}':
     *  get:
     *     tags:
     *     - Community
     *     summary: Obtener una comunidad
     *     parameters:
     *     - name: _id
     *       in: path
     *       required: true
     *       description: ID de la comunidad
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
     *                type: ObjectId
     *                default: ''
     *     responses:
     *      200:
     *        description: se accedio a la comunidad
     *      418:
     *        description: usuario baneado de esta comunidad
     *      500:
     *         description: server err
     */
  
/** getCommunities
     * @openapi
     * '/api/community/getCommunities':
     *  get:
     *     tags:
     *     - Community
     *     summary: Obtener todas las comunidades
     *     responses:
     *      200:
     *        description: todas las comunidades
     *      500:
     *         description: server err
     */
  
/** getCommunitiesForCategories
     * @openapi
     * '/api/community/getCommunitiesForCategories':
     *  get:
     *     tags:
     *     - Community
     *     summary: Obtener comunidades por categoria
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - communityCategory_id
     *            properties:
     *               communityCategory_id:
     *                 type: array
     *                 items:
     *                   type: string
     *     responses:
     *      200:
     *        description: se accedio a la comunidad
     *      418:
     *        description: usuario baneado de esta comunidad
     *      500:
     *         description: server err
     */
  
/** getCommunityChats
     * @openapi
     * '/api/community/getCommunityChats/{_id}':
     *  get:
     *     tags:
     *     - Community
     *     summary: Obtener los chats de una comunidad
     *     parameters:
     *     - name: _id
     *       in: path
     *       required: true
     *       description: ID de la comunidad
     *     responses:
     *      200:
     *        description: se accedio a la comunidad
     *      418:
     *        description: usuario baneado de esta comunidad
     *      500:
     *         description: server err
     */
  
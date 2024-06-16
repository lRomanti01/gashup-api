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
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - name
     *              - owner_id
     *              - description
     *              - img
     *              - communityCategory_id
     *            properties:
     *              name:
     *                type: string
     *                default: ''
     *              owner_id:
     *                type: ObjectId
     *                default: ''
     *              description:
     *                type: string
     *                default: ''
     *              img:
     *                type: string
     *                default: ''
     *              communityCategory_id:
     *                type: array
     *                default: ''
     *     responses:
     *      201:
     *        description: se creo la comunidad correctamente
     *      404:
     *        description: usuario o comunidad no encontrados
     *      500:
     *         description: server err
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
 *         application/json:
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
 *                 default: ''
 *     responses:
 *       201:
 *         description: se creo el chat para la comunidad correctamente
 *       500:
 *         description: server err
 */

    /** joinChatCommunity
 * @openapi
 * /api/community/joinChatCommunity:
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
 * '/api/community/joinCommunity/:_id':
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
     * '/api/community/updateCommunity/:id':
     *  put:
     *     tags:
     *     - Community
     *     summary: actualizar datos de una comunidad
     *     parameters:
     *     - name: _id
     *       in: path
     *       required: true
     *       description: ID de la comunidad a actualizar
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - name
     *              - userID
     *              - description
     *              - img
     *              - communityCategory_id
     *            properties:
     *              name:
     *                type: string
     *                default: ''
     *              userID:
     *                type: ObjectId
     *                default: ''
     *              description:
     *                type: string
     *                default: ''
     *              img:
     *                type: string
     *                default: ''
     *              communityCategory_id:
     *                type: string
     *                default: ''

     *     responses:
     *      201:
     *        description: se creo la comunidad correctamente
     *      500:
     *         description: server err
     */

     /** assignAdmins
     * @openapi
     * '/api/community/assignAdmins':
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
     * '/api/community/updateCommunityChat':
     *  put:
     *     tags:
     *     - Community
     *     summary: asignar admins a la comunidad
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
     *              - name
     *              - img
     *            properties:
     *              name:
     *                type: string
     *                default: ''
     *              img:
     *                type: string
     *                default: ''
     *     responses:
     *      200:
     *        description: se asignaron los admins la comunidad correctamente
     *      404:
     *        description: chat no encontrado
     *      500:
     *         description: server err
     */
/** DELETE Methods */
    /** deleteCommunity
     * @openapi
     * '/api/community/deleteCommunity':
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
     *              - owner_id
     *            properties:
     *              owner_id:
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
     * '/api/community/banFromCommunity':
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

    /** leaveChatCommunity
     * @openapi
     * '/api/community/leaveChatCommunity':
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
     * '/api/community/deleteCommunityChat':
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
     *              - owner_id
     *            properties:
     *              owner_id:
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

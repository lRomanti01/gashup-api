/** POST Methods */
/** createUser
 * @openapi
 * '/api/user/createUser':
 *   post:
 *     tags:
 *       - Users
 *     summary: crear un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - code
 *               - img
 *               - banner
 *               - password
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 default: ''
 *               phone:
 *                 type: string
 *                 default: ''
 *               role:
 *                 type: string
 *                 default: ''
 *               img:
 *                 type: string
 *                 format: binary
 *               banner:
 *                 type: string
 *                 format: binary
 *               password:
 *                 type: string
 *                 default: ''
 *               email:
 *                 type: string
 *                 default: ''
 *     responses:
 *       200:
 *         description: se envio correo para validar
 *       500:
 *         description: error del servidor
 */

/** PUT Methods */
/** updateUser
 * @openapi
 * '/api/user/updateUser/id':
 *   put:
 *     tags:
 *       - Users
 *     summary: actualizar un usuario
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a actualizar
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
 *               - phone
 *               - code
 *               - img
 *               - password
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *               img:
 *                 type: string
 *                 format: binary
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: usuario actualizado correctamente
 *       500:
 *         description: error del servidor
 */

/** follow
* @openapi
* '/api/user/follow/:id':
*  put:
*     tags:
*     - Users
*     summary: seguir a un usuario
*     parameters:
*      - name: id 
*        in: path
*        description: id del usuario logeado
*        required: true
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - userToFollow
*            properties:
*              userToFollow:
*                type: string
*                default: ''
*     responses:
*      200:
*        description: se siguio al usuario
*      500:
*         description: server err
*      403:
*         description: ya se sigue al usuario
*/

/** unfollow
* @openapi
* '/api/user/unfollow/:id':
*  put:
*     tags:
*     - Users
*     summary: dejar de seguir a un usuario
*     parameters:
*      - name: id 
*        in: path
*        description: id del usuario logeado
*        required: true
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - userToFollow
*            properties:
*              userToFollow:
*                type: string
*                default: ''
*     responses:
*      200:
*        description: se dejo de seguir al usuario
*      500:
*         description: server err
*      403:
*         description: no sigues sigues a este usuario
*/

/** DELETE Methods */
/** deleteUser
 * @openapi
 * /api/user/deleteUser/id:
 *   delete:
 *     tags:
 *       - Users
 *     summary: borrar usuario
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: usuario eliminado
 *       500:
 *         description: server err
 */

/** GET Methods */
/** getUserByRol
 * @openapi
 * /api/user/getUserByRol/:code:
 *   get:
 *     tags:
 *       - Users
 *     summary: obtener usuarios por roles
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: codigo del rol
 *     responses:
 *       200:
 *         description: usuarios obtenidos
 *       500:
 *         description: server err
 */

/** getuser
 * @openapi
 * /api/user/getuser:
 *   get:
 *     tags:
 *       - Users
 *     summary: obtener datos de usuario
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
 */




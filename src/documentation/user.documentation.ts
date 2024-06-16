/** POST Methods */
    /**
     * @openapi
     * '/api/user/createUser':
     *  post:
     *     tags:
     *     - Users
     *     summary: crear un usuario
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - name
     *              - phone
     *              - code
     *              - img
     *              - password
     *              - email
     *            properties:
     *              name:
     *                type: string
     *                default: ''
     *              phone:
     *                type: string
     *                default: ''
     *              role:
     *                type: ObjectId
     *                default: ''
     *              img:
     *                type: string
     *                default: ''
     *              password:
     *                type: string
     *                default: ''
     *              email:
     *                type: string
     *                default: ''
     *     responses:
     *      201:
     *        description: Mensaje; se envio correo para validar
     *      500:
     *         description: server err
     */
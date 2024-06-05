/** POST Methods */
    /**
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
     *                type: string
     *                default: ''

     *     responses:
     *      201:
     *        description: se creo la comunidad correctamente
     *      500:
     *         description: server err
     */

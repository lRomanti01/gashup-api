/**
 * @swagger
 * components:
 *   schemas:
 *     community:
 *       type: object
 *       required:
 *         - name
 *         - owner_id
 *         - description
 *         - img
 *       optional:
 *         - members_id
 *         - admins_id
 *         - bannedUsers_id
 *         - communityCategory_id
 * 
 *       properties:
 *         name:
 *           type: string
 *           descripcion: nombre de la comunidad
 *         owner_id:
 *           type: Types.ObjectId
 *           descripcion: ID del dueño de la comunidad
 *         description:
 *           type: string
 *           descripcion: breve descripcion sobre la comunidad
 *         members_id:
 *           type: Array<Types.ObjectId>
 *           descripcion: ID de los miembros de la comunidad
 *         img:
 *           type: String
 *           descripcion: foto de perfil de la comunidad
 *         admins_id:
 *           type: Array<Types.ObjectId>
 *           descripcion: ID de las admins de la comunidad
 *         bannedUsers_id:
 *           type: Array<Types.ObjectId>
 *           descripcion: ID de los usuarios baneados de la comunidad
 *         communityCategory_id:
 *           type: Array<Types.ObjectId>
 *           descripcion: ID de las categoria a la que pertenece la comunidad
 * 
 *       example:
 *         name: lol
 *         owner_id: 142542
 *         desciption: NO LO JUEGUEN
 *         members_id: [74747,474744,7474747]
 *         img: https/firisdsdsdi/dfsdsdsdsdsdf85dffd/dfd
 *         admins_id: [7478,85858,96986]
 *         bannedUsers_id: [5555,444,333]
 *         communityCategory_id: [4141,2323,89968]
 * 
 * 
 * 
 *     user:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - password
 *         - img
 *         - role
 * 
 *       properties:
 *         name:
 *           type: string
 *           descripcion: nombre del usuario
 *         email:
 *           type: String
 *           descripcion: correo electronico del usuario
 *         phone:
 *           type: string
 *           descripcion: numero telefonico del usuario
 *         password:
 *           type: String
 *           descripcion: Contraseña del usuario
 *         img:
 *           type: String
 *           descripcion: foto de perfil del usuario
 *         role:
 *           type: Types.ObjectId
 *           descripcion: rol del usuario
 * 
 *       example:
 *         name: jose
 *         email: Manuel@gmail.com
 *         phone: 829-44-5655
 *         password: [74747,474744,7474747]
 *         img: https/firiei/dffdf85dffd/dfd
 *         role: 74874751755
 * 
 * @swagger
 *  tags:
 *    name: schemas
 */
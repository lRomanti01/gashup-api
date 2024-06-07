import swaggerJsDoc from "swagger-jsdoc"

const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API proyecto final",
      version: "1.0.0",
      description: "Una pagina de comunidades",
    },
  },
  apis: [
    `${__dirname}/documentation/*.ts`,
  ],
})

export default swaggerSpec
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN STACK EXAMPLE 01",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://mernstack-example-01-production-c8a7.up.railway.app/",
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: "apiKey",
          description:
            "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
          name: "Authorization",
          in: "header",
        },
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./schema/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app, port) => {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
};

module.exports = swaggerDocs;

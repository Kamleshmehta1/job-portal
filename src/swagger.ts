import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Job Portal API",
    description: "Freelance Marketplace REST API",
  },
  host: "localhost:6999",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = "./swagger-output.json";
const routes = ["./server.ts"];

swaggerAutogen()(outputFile, routes, doc);

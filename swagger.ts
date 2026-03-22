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
      in: "header",
      name: "Authorization",
    },
  },
};

const outputFile = "./src/config/swagger-output.json";
const routes = ["./server.js"];

swaggerAutogen()(outputFile, routes, doc);

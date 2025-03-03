const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/type/defs");
const resolvers = require("./graphql/resolvers/themeResolver");

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    mongoose.connect("mongodb://localhost:27017/builder", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("MongoDB connected"))
      .catch(err => console.error(err));

    app.listen(4000, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });
}

startServer();

const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLInputObjectType } = require("graphql");
const PageType = require("../models/pageSchema");  // Import your Mongoose model here
const Page = require("../models/pageSchema");

const PageInputType = new GraphQLInputObjectType({
  name: "PageInput",
  fields: {
    storeId: { type: GraphQLID },
    name: { type: GraphQLString },
    path: { type: GraphQLString },
    components: { type: GraphQLString },
    templates: { type: GraphQLID },
    metadata: { type: GraphQLString },
    isPublished: { type: GraphQLBoolean },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createPage: {
      type: PageType,  // The type returned by the mutation
      args: {
        input: { type: PageInputType }
      },
      resolve: async (parent, { input }) => {
        const newPage = new Page({
          storeId: input.storeId,
          name: input.name,
          path: input.path,
          components: input.components,
          templates: input.templates,
          metadata: input.metadata,
          isPublished: input.isPublished,
        });
        try {
          await newPage.save();
          return newPage;  // Return the created page
        } catch (error) {
          throw new Error("Error creating page: " + error.message);
        }
      }
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {}
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Theme {
        id: ID!
        storeId: ID!
        name: String!
        metadata: JSON
        isPublished: Boolean
        createdAt: String
        updatedAt: String
        pageIds: [ID!]
    }

    type Page {
        id: ID!
        themeId: ID!
        title: String!
        content: String
        metadata: JSON
        createdAt: String
        updatedAt: String
    }

    scalar JSON

    type Query {
        getThemes: [Theme]
        getTheme(id: ID!): Theme
        getPages(themeId: ID!): [Page]
        getPage(id: ID!): Page
    }

    type Mutation {
        createTheme(storeId: ID!, name: String!, metadata: JSON, isPublished: Boolean, pageIds: [ID!]): Theme
        updateTheme(id: ID!, name: String, metadata: JSON, isPublished: Boolean, pageIds: [ID!]): Theme
        deleteTheme(id: ID!): Boolean

        createPage(themeId: ID!, title: String!, content: String, metadata: JSON): Page
        updatePage(id: ID!, title: String, content: String, metadata: JSON): Page
        deletePage(id: ID!): Boolean
    }
`;

module.exports = typeDefs;

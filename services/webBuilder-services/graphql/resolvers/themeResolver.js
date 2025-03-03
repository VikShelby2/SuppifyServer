const Theme = require("../../models/themeSchema");
const Page = require("../../models/pageSchema");

const resolvers = {
    Query: {
        getThemes: async () => await Theme.find(),
        getTheme: async (_, { id }) => await Theme.findById(id),
        getPages: async (_, { themeId }) => await Page.find({ themeId }),
        getPage: async (_, { id }) => await Page.findById(id),
    },
    Mutation: {
        createTheme: async (_, { storeId, name, metadata, isPublished, pageIds }) => {
            const theme = new Theme({ storeId, name, metadata, isPublished, pageIds });
            await theme.save();
            return theme;
        },
        updateTheme: async (_, { id, name, metadata, isPublished, pageIds }) => {
            return await Theme.findByIdAndUpdate(id, { name, metadata, isPublished, pageIds }, { new: true });
        },
        deleteTheme: async (_, { id }) => {
            const deleted = await Theme.findByIdAndDelete(id);
            return !!deleted;
        },

        createPage: async (_, { themeId, title, content, metadata }) => {
            const page = new Page({ themeId, title, content, metadata });
            await page.save();
            
            // Add the new page ID to the Theme's `pageIds` array
            await Theme.findByIdAndUpdate(themeId, { $push: { pageIds: page._id } });

            return page;
        },
        updatePage: async (_, { id, title, content, metadata }) => {
            return await Page.findByIdAndUpdate(id, { title, content, metadata }, { new: true });
        },
        deletePage: async (_, { id }) => {
            const page = await Page.findByIdAndDelete(id);
            if (page) {
                await Theme.findByIdAndUpdate(page.themeId, { $pull: { pageIds: id } });
            }
            return !!page;
        },
    },
};

module.exports = resolvers;

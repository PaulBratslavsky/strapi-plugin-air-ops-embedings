// @ts-nocheck
const pluginManager = require("../initialize");

const { sanitize } = require("@strapi/utils");
const { contentAPI } = sanitize;

module.exports = ({ strapi }) => ({
  async createEmbedding(data) {
    const entity = await strapi.entityService.create(
      "plugin::open-ai-embeddings.embedding",
      data
    );

    const document = {
      name: entity.title,
      text: data.data.content,
      metadata: {
        id: entity.id,
        title: entity.title,
        collectionType: data.data.collectionType,
        fieldName: data.data.fieldName,
      },
    };

    const embeddingResponse = await pluginManager.createEmbedding(document);

    data.data.embeddingsId = String(embeddingResponse.id);
    data.data.vectorStoreId = String(embeddingResponse.vector_store_id);
    data.data.embeddings = JSON.stringify(embeddingResponse.source);

    console.log(data);

    try {
      const updatedEntity = await strapi.entityService.update(
        "plugin::open-ai-embeddings.embedding",
        entity.id,
        data
      );

      return updatedEntity;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteEmbedding(params) {
    const currentEntry = await strapi.entityService.findOne(
      "plugin::open-ai-embeddings.embedding",
      params.id
    );

    const id = currentEntry.embeddingsId;
    await pluginManager.deleteEmbedding(id);
    
    const delEntryResponse = await strapi.entityService.delete(
      "plugin::open-ai-embeddings.embedding",
      params.id
    );

    return delEntryResponse;
  },

  async queryEmbeddings(data) {
    const emptyQuery = data?.query ? false : true;
    if (emptyQuery) return { error: "Please provide a query" };

    const response = await pluginManager.queryEmbedding(data.query);
    console.log(response);
    return response;
  },
  async getEmbedding(ctx) {
    const contentType = strapi.contentType(
      "plugin::open-ai-embeddings.embedding"
    );
    const sanitizedQueryParams = await contentAPI.query(
      ctx.query,
      contentType,
      ctx.state.auth
    );

    return await strapi.entityService.findOne(
      contentType.uid,
      ctx.params.id,
      sanitizedQueryParams
    );
  },

  async getEmbeddings(ctx) {
    const contentType = strapi.contentType(
      "plugin::open-ai-embeddings.embedding"
    );
    const sanitizedQueryParams = await contentAPI.query(
      ctx.query,
      contentType,
      ctx.state.auth
    );

    const count = await strapi.entityService.count(
      contentType.uid,
      sanitizedQueryParams
    );

    const totalCount = await strapi.entityService.count(contentType.uid);

    const data = await strapi.entityService.findMany(
      contentType.uid,
      sanitizedQueryParams
    );

    return { data, count, totalCount };
  },
});

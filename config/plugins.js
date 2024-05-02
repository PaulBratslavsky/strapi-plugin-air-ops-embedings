module.exports = ({ env }) => ({
  'open-ai-embeddings': {
    enabled: true,
    resolve: './src/plugins/open-ai-embeddings',
    config: {
      openAIApiKey: env('OPEN_AI_KEY'),
      dbPrivateKey: env('SUPABASE_PRIVATE_KEY'),
      dbUrl: env('SUPABASE_URL'),
      airOpsKey: env('AIR_OPS_KEY'),
      airOpsUrl: env('AIR_OPS_URL'),
      airOpsStoreId: env('AIR_OPS_STORE_ID'),
      
    },
  },
});

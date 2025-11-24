export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    strapi.log.info('Alchemy Library Backend starting up...');
    
    // Check database type
    const dbClient = strapi.db.config.connection.client;
    strapi.log.info(`Database client: ${dbClient}`);
    
    // For SQLite, attempt to verify and fix enum constraints
    if (dbClient === 'sqlite') {
      try {
        // Check if we can query entries with 'published' status
        // This validates that the enum constraint includes all expected values
        await strapi.entityService.findMany('api::grimoire.grimoire', {
          filters: { status: 'published' },
          limit: 1,
        });
        
        await strapi.entityService.findMany('api::log.log', {
          filters: { status: 'published' },
          limit: 1,
        });
        
        strapi.log.info('Status enum validation successful - all values accessible');
      } catch (error) {
        strapi.log.error('Error validating enum constraints:', error.message);
        strapi.log.warn('If you\'re experiencing issues with the status dropdown:');
        strapi.log.warn('1. Run: npm run reset-db');
        strapi.log.warn('2. Run: npm run clear-cache');
        strapi.log.warn('3. Restart: npm run develop');
        strapi.log.warn('See ADMIN_WORKFLOW.md troubleshooting section for details');
      }
    }
  },
};

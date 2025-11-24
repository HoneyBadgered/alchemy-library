import { sendDraftNotification } from '../../../../services/email';
import { generateDraft } from '../../../../services/ai';

export default {
  async afterCreate(event) {
    const { result } = event;

    if (result.status === 'pending_ai') {
      try {
        const draftContent = await generateDraft({
          title: result.title,
          postType: 'grimoire',
          additionalContext: result.excerpt || '',
          category: result.category || '',
        });

        await strapi.entityService.update('api::grimoire.grimoire', result.id, {
          data: {
            draftBody: draftContent,
            status: 'draft_ready',
          },
        });

        await sendDraftNotification({
          id: result.id,
          title: result.title,
          postType: 'grimoire',
          draftBody: draftContent,
        });

        strapi.log.info(`AI draft generated for Grimoire #${result.id}: ${result.title}`);
      } catch (error) {
        strapi.log.error(`Failed to generate AI draft for Grimoire #${result.id}:`, error);
        
        await strapi.entityService.update('api::grimoire.grimoire', result.id, {
          data: {
            status: 'needs_changes',
          },
        });
      }
    }
  },

  async beforeUpdate(event) {
    const { params } = event;
    
    // Check if status is being changed to 'published'
    if (params.data.status === 'published') {
      // Fetch the current entry to get draftBody
      const entry = await strapi.entityService.findOne('api::grimoire.grimoire', params.where.id);
      
      // If draftBody exists and publishedBody is empty, copy draftBody to publishedBody
      if (entry && entry.draftBody && !params.data.publishedBody) {
        params.data.publishedBody = entry.draftBody;
        strapi.log.info(`Auto-copying draftBody to publishedBody for Grimoire #${params.where.id}`);
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    if (result.status === 'pending_ai' && !result.draftBody) {
      try {
        const draftContent = await generateDraft({
          title: result.title,
          postType: 'grimoire',
          additionalContext: result.excerpt || '',
          category: result.category || '',
        });

        await strapi.entityService.update('api::grimoire.grimoire', result.id, {
          data: {
            draftBody: draftContent,
            status: 'draft_ready',
          },
        });

        await sendDraftNotification({
          id: result.id,
          title: result.title,
          postType: 'grimoire',
          draftBody: draftContent,
        });

        strapi.log.info(`AI draft regenerated for Grimoire #${result.id}: ${result.title}`);
      } catch (error) {
        strapi.log.error(`Failed to regenerate AI draft for Grimoire #${result.id}:`, error);
      }
    }
  },
};

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
      // Only proceed if publishedBody is not already being set
      if (!params.data.publishedBody) {
        // Ensure we have an ID to work with
        const id = params.where?.id;
        if (!id) {
          strapi.log.warn('Cannot auto-copy draftBody: missing entry ID');
          return;
        }
        
        // Fetch the current entry to get draftBody
        const entry = await strapi.entityService.findOne('api::grimoire.grimoire', id);
        
        // If draftBody exists, copy it to publishedBody
        if (entry?.draftBody) {
          params.data.publishedBody = entry.draftBody;
          strapi.log.info(`Auto-copying draftBody to publishedBody for Grimoire #${id}`);
        }
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

import { sendDraftNotification } from '../../../../services/email';
import { generateDraft } from '../../../../services/ai';

export default {
  async afterCreate(event) {
    const { result } = event;

    // Only process if status is pending_ai
    if (result.status === 'pending_ai') {
      try {
        // Generate AI draft
        const draftContent = await generateDraft({
          title: result.title,
          postType: 'log',
          additionalContext: result.excerpt || '',
        });

        // Update the entry with the generated draft
        await strapi.entityService.update('api::log.log', result.id, {
          data: {
            draftBody: draftContent,
            status: 'draft_ready',
          },
        });

        // Send email notification
        await sendDraftNotification({
          id: result.id,
          title: result.title,
          postType: 'log',
          draftBody: draftContent,
        });

        strapi.log.info(`AI draft generated for Log #${result.id}: ${result.title}`);
      } catch (error) {
        strapi.log.error(`Failed to generate AI draft for Log #${result.id}:`, error);
        
        // Update status to needs_changes on error
        await strapi.entityService.update('api::log.log', result.id, {
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
        // First check if draftBody is in the current update data
        let draftBody = params.data.draftBody;
        
        // If not in update data, fetch from database
        if (!draftBody) {
          // Ensure we have an ID to work with
          const id = params.where?.id;
          if (!id) {
            strapi.log.warn('Cannot auto-copy draftBody: missing entry ID');
            return;
          }
          
          // Fetch the current entry to get draftBody
          const entry = await strapi.entityService.findOne('api::log.log', id);
          draftBody = entry?.draftBody;
        }
        
        // If draftBody exists, copy it to publishedBody
        if (draftBody) {
          params.data.publishedBody = draftBody;
          strapi.log.info(`Auto-copying draftBody to publishedBody for Log #${params.where?.id}`);
        }
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // If status changed to pending_ai (regeneration requested)
    if (result.status === 'pending_ai' && !result.draftBody) {
      try {
        const draftContent = await generateDraft({
          title: result.title,
          postType: 'log',
          additionalContext: result.excerpt || '',
        });

        await strapi.entityService.update('api::log.log', result.id, {
          data: {
            draftBody: draftContent,
            status: 'draft_ready',
          },
        });

        await sendDraftNotification({
          id: result.id,
          title: result.title,
          postType: 'log',
          draftBody: draftContent,
        });

        strapi.log.info(`AI draft regenerated for Log #${result.id}: ${result.title}`);
      } catch (error) {
        strapi.log.error(`Failed to regenerate AI draft for Log #${result.id}:`, error);
      }
    }
  },
};

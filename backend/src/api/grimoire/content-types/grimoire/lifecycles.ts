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

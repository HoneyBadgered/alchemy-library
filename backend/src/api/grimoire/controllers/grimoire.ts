/**
 * grimoire controller
 */

import { factories } from '@strapi/strapi';
import { regenerateDraft } from '../../../services/ai';
import { sendDraftNotification } from '../../../services/email';

export default factories.createCoreController('api::grimoire.grimoire', ({ strapi }) => ({
  // Approve draft and publish
  async approve(ctx) {
    const { id } = ctx.params;

    try {
      const entry = await strapi.entityService.findOne('api::grimoire.grimoire', id);

      if (!entry) {
        return ctx.notFound('Grimoire entry not found');
      }

      // Copy draftBody to publishedBody and set status to published
      const updated = await strapi.entityService.update('api::grimoire.grimoire', id, {
        data: {
          publishedBody: entry.draftBody,
          status: 'published',
        },
      });

      return { data: updated };
    } catch (error) {
      strapi.log.error('Error approving grimoire:', error);
      return ctx.badRequest('Failed to approve grimoire');
    }
  },

  // Reject draft
  async reject(ctx) {
    const { id } = ctx.params;

    try {
      const updated = await strapi.entityService.update('api::grimoire.grimoire', id, {
        data: {
          status: 'needs_changes',
        },
      });

      return { data: updated };
    } catch (error) {
      strapi.log.error('Error rejecting grimoire:', error);
      return ctx.badRequest('Failed to reject grimoire');
    }
  },

  // Trigger AI regeneration
  async regenerate(ctx) {
    const { id } = ctx.params;
    const { instructions } = ctx.request.body?.data || {};

    try {
      const entry = await strapi.entityService.findOne('api::grimoire.grimoire', id);

      if (!entry) {
        return ctx.notFound('Grimoire entry not found');
      }

      const newDraft = await regenerateDraft({
        title: entry.title,
        postType: 'grimoire',
        additionalContext: entry.excerpt || '',
        category: entry.category || '',
        instructions,
        currentDraft: entry.draftBody,
      });

      const updated = await strapi.entityService.update('api::grimoire.grimoire', id, {
        data: {
          draftBody: newDraft,
          status: 'draft_ready',
        },
      });

      await sendDraftNotification({
        id,
        title: entry.title,
        postType: 'grimoire',
        draftBody: newDraft,
      });

      return { 
        data: updated,
        message: 'Draft regenerated successfully',
      };
    } catch (error) {
      strapi.log.error('Error regenerating grimoire:', error);
      return ctx.badRequest('Failed to regenerate grimoire');
    }
  },
}));

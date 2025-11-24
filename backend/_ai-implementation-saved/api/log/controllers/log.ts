/**
 * log controller
 */

import { factories } from '@strapi/strapi';
import { regenerateDraft } from '../../../services/ai';
import { sendDraftNotification } from '../../../services/email';

export default factories.createCoreController('api::log.log', ({ strapi }) => ({
  // Approve draft and publish
  async approve(ctx) {
    const { id } = ctx.params;

    try {
      const entry = await strapi.entityService.findOne('api::log.log', id);

      if (!entry) {
        return ctx.notFound('Log entry not found');
      }

      // Copy draftBody to publishedBody and set status to published
      const updated = await strapi.entityService.update('api::log.log', id, {
        data: {
          publishedBody: entry.draftBody,
          status: 'published',
        },
      });

      return { data: updated };
    } catch (error) {
      strapi.log.error('Error approving log:', error);
      return ctx.badRequest('Failed to approve log');
    }
  },

  // Reject draft
  async reject(ctx) {
    const { id } = ctx.params;

    try {
      const updated = await strapi.entityService.update('api::log.log', id, {
        data: {
          status: 'needs_changes',
        },
      });

      return { data: updated };
    } catch (error) {
      strapi.log.error('Error rejecting log:', error);
      return ctx.badRequest('Failed to reject log');
    }
  },

  // Trigger AI regeneration
  async regenerate(ctx) {
    const { id } = ctx.params;
    const { instructions } = ctx.request.body?.data || {};

    try {
      const entry = await strapi.entityService.findOne('api::log.log', id);

      if (!entry) {
        return ctx.notFound('Log entry not found');
      }

      const newDraft = await regenerateDraft({
        title: entry.title,
        postType: 'log',
        additionalContext: entry.excerpt || '',
        instructions,
        currentDraft: entry.draftBody,
      });

      const updated = await strapi.entityService.update('api::log.log', id, {
        data: {
          draftBody: newDraft,
          status: 'draft_ready',
        },
      });

      await sendDraftNotification({
        id,
        title: entry.title,
        postType: 'log',
        draftBody: newDraft,
      });

      return { 
        data: updated,
        message: 'Draft regenerated successfully',
      };
    } catch (error) {
      strapi.log.error('Error regenerating log:', error);
      return ctx.badRequest('Failed to regenerate log');
    }
  },
}));

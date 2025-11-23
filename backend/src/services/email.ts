import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface DraftNotificationParams {
  id: number;
  title: string;
  postType: 'log' | 'grimoire';
  draftBody: string;
}

export async function sendDraftNotification(params: DraftNotificationParams): Promise<void> {
  const { id, title, postType, draftBody } = params;

  const baseUrl = process.env.BASE_URL || 'http://localhost:1337';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

  // Generate approve/reject URLs
  const approveUrl = `${baseUrl}/api/${postType}s/${id}/approve`;
  const rejectUrl = `${baseUrl}/api/${postType}s/${id}/reject`;
  const editUrl = `${baseUrl}/admin/content-manager/collection-types/api::${postType}.${postType}/${id}`;

  // Truncate draft for email preview
  const draftPreview = draftBody.substring(0, 500) + (draftBody.length > 500 ? '...' : '');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Draft Ready: ${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 10px;
    }
    .content {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .content h2 {
      margin-top: 0;
      color: #667eea;
    }
    .draft-preview {
      background: white;
      padding: 20px;
      border-left: 4px solid #667eea;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.8;
      color: #555;
    }
    .actions {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      margin: 0 10px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s;
    }
    .button-approve {
      background: #10b981;
      color: white;
    }
    .button-approve:hover {
      background: #059669;
    }
    .button-reject {
      background: #ef4444;
      color: white;
    }
    .button-reject:hover {
      background: #dc2626;
    }
    .button-edit {
      background: #667eea;
      color: white;
    }
    .button-edit:hover {
      background: #5568d3;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .info {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧪 New Draft Ready for Review</h1>
    <div class="badge">${postType.toUpperCase()}</div>
  </div>

  <div class="content">
    <h2>${title}</h2>
    
    <div class="info">
      <strong>📝 AI-Generated Draft</strong><br>
      This draft was automatically created using AI. Please review and edit as needed before publishing.
    </div>

    <h3>Draft Preview:</h3>
    <div class="draft-preview">
      ${draftPreview.replace(/\n/g, '<br>')}
    </div>
  </div>

  <div class="actions">
    <a href="${editUrl}" class="button button-edit">✏️ Edit in Strapi</a>
  </div>

  <div class="actions">
    <a href="${approveUrl}" class="button button-approve">✅ Approve & Publish</a>
    <a href="${rejectUrl}" class="button button-reject">❌ Needs Changes</a>
  </div>

  <div class="footer">
    <p>The Alchemy Table Library</p>
    <p>This is an automated notification from your Strapi CMS.</p>
  </div>
</body>
</html>
`;

  const textContent = `
New Draft Ready for Review
===========================

Type: ${postType.toUpperCase()}
Title: ${title}

Draft Preview:
--------------
${draftPreview}

Actions:
--------
Edit in Strapi: ${editUrl}
Approve & Publish: ${approveUrl}
Needs Changes: ${rejectUrl}

---
The Alchemy Table Library
This is an automated notification from your Strapi CMS.
`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Alchemy Library" <noreply@alchemy-library.com>',
      to: adminEmail,
      subject: `🧪 New Draft Ready: ${title}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Draft notification email sent for ${postType} #${id}`);
  } catch (error) {
    console.error('Failed to send draft notification email:', error);
    // Don't throw - email failure shouldn't break the workflow
  }
}

export async function sendRejectionNotification(params: {
  id: number;
  title: string;
  postType: 'log' | 'grimoire';
  feedback: string;
}): Promise<void> {
  const { id, title, postType, feedback } = params;

  const baseUrl = process.env.BASE_URL || 'http://localhost:1337';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const editUrl = `${baseUrl}/admin/content-manager/collection-types/api::${postType}.${postType}/${id}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Draft Rejected: ${title}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #fee2e2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
    <h2 style="color: #dc2626; margin-top: 0;">Draft Rejected</h2>
    <p><strong>Title:</strong> ${title}</p>
    <p><strong>Type:</strong> ${postType.toUpperCase()}</p>
    
    ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ''}
    
    <p style="margin-top: 20px;">
      <a href="${editUrl}" style="display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 4px;">Edit in Strapi</a>
    </p>
  </div>
</body>
</html>
`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Alchemy Library" <noreply@alchemy-library.com>',
      to: adminEmail,
      subject: `Draft Rejected: ${title}`,
      html: htmlContent,
    });

    console.log(`Rejection notification email sent for ${postType} #${id}`);
  } catch (error) {
    console.error('Failed to send rejection notification email:', error);
  }
}

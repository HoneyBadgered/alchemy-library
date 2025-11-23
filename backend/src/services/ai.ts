import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert content writer for The Alchemy Table Library, a knowledge repository that combines mystical theming with practical, educational content.

The Alchemy Table Library contains two types of posts:

1. **Log**: Short-form posts (300-800 words) for updates, announcements, and casual blog content. These should be conversational, engaging, and concise.

2. **Grimoire**: Long-form articles (1000-3000 words) for guides, tutorials, educational content, and deep dives. These should be comprehensive, well-structured, and authoritative.

Your writing style should:
- Be clear, engaging, and accessible
- Use mystical/alchemical metaphors sparingly and tastefully
- Focus on delivering practical value
- Include relevant examples and explanations
- Use proper markdown formatting with headers, lists, and code blocks where appropriate
- Be SEO-friendly with natural keyword usage

Generate content that is informative, well-researched, and valuable to readers interested in knowledge management, learning, and personal development.`;

interface GenerateDraftParams {
  title: string;
  postType: 'log' | 'grimoire';
  additionalContext?: string;
  category?: string;
  instructions?: string;
}

export async function generateDraft(params: GenerateDraftParams): Promise<string> {
  const { title, postType, additionalContext, category, instructions } = params;

  // Construct user prompt
  let userPrompt = `Generate a ${postType === 'log' ? 'short-form blog post (Log)' : 'comprehensive long-form article (Grimoire)'} with the following title: "${title}"`;

  if (additionalContext) {
    userPrompt += `\n\nAdditional context: ${additionalContext}`;
  }

  if (category && postType === 'grimoire') {
    userPrompt += `\n\nCategory: ${category}`;
  }

  if (instructions) {
    userPrompt += `\n\nSpecial instructions: ${instructions}`;
  }

  if (postType === 'log') {
    userPrompt += '\n\nLength: 300-800 words\nFormat: Conversational and engaging\nStructure: Brief introduction, 2-3 main points, conclusion';
  } else {
    userPrompt += '\n\nLength: 1000-3000 words\nFormat: Comprehensive and authoritative\nStructure: Introduction, multiple detailed sections with subheadings, practical examples, conclusion with key takeaways';
  }

  userPrompt += '\n\nGenerate the content in markdown format with proper headers, formatting, and structure.';

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: postType === 'log' ? 1500 : 4000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    return content;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log to console for now since strapi may not be available in this context
    // In production, this service should be called from Strapi context where strapi.log is available
    if (typeof strapi !== 'undefined' && strapi.log) {
      strapi.log.error('OpenAI API error:', error);
    } else {
      console.error('OpenAI API error:', error);
    }
    
    throw new Error(`Failed to generate AI content: ${errorMessage}`);
  }
}

export async function regenerateDraft(
  params: GenerateDraftParams & { currentDraft?: string }
): Promise<string> {
  const { currentDraft, ...restParams } = params;

  if (currentDraft && restParams.instructions) {
    // If we have a current draft and specific instructions, modify it
    const userPrompt = `Here is the current draft:\n\n${currentDraft}\n\nPlease revise it according to these instructions: ${restParams.instructions}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: restParams.postType === 'log' ? 1500 : 4000,
    });

    return completion.choices[0]?.message?.content || currentDraft;
  }

  // Otherwise, generate a fresh draft
  return generateDraft(restParams);
}

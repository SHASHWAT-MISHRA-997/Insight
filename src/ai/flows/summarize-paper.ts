'use server';
/**
 * @fileOverview A research paper summarization AI agent.
 *
 * - summarizePaper - A function that handles the paper summarization process.
 * - SummarizePaperInput - The input type for the summarizePaper function.
 * - SummarizePaperOutput - The return type for the summarizePaper function.
 */

import {ai} from '@/ai/ai-instance';
import {timeout} from '@/lib/utils';
import {z} from 'genkit';

const SummarizePaperInputSchema = z.object({
  paperText: z.string().describe('The text content of the research paper.'),
});
export type SummarizePaperInput = z.infer<typeof SummarizePaperInputSchema>;

const SummarizePaperOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the research paper.'),
});
export type SummarizePaperOutput = z.infer<typeof SummarizePaperOutputSchema>;

export async function summarizePaper(input: SummarizePaperInput): Promise<SummarizePaperOutput> {
  return summarizePaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePaperPrompt',
  input: {
    schema: z.object({
      paperText: z.string().describe('The text content of the research paper.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the research paper.'),
    }),
  },
  prompt: `You are an expert in summarizing academic research papers. Please provide a concise summary of the paper below, highlighting the key findings, arguments, and conclusions.\n\nPaper Text: {{{paperText}}}`,
});

const summarizePaperFlow = ai.defineFlow<
  typeof SummarizePaperInputSchema,
  typeof SummarizePaperOutputSchema
>(
  {
    name: 'summarizePaperFlow',
    inputSchema: SummarizePaperInputSchema,
    outputSchema: SummarizePaperOutputSchema,
  },
  async input => {
    try {
      const timedPrompt = timeout(120 * 1000, prompt(input));
      const {output} = await timedPrompt;
      return output!;
    } catch (error) {
      console.error('Error summarizing paper:', error);
      return {
        summary: 'There was an error generating the summary',
      };
    }
  }
);
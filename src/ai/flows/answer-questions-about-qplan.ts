'use server';
/**
 * @fileOverview A question answering AI agent for QPlan events and resources.
 *
 * - answerQuestionsAboutQPlan - A function that handles question answering about QPlan.
 * - AnswerQuestionsAboutQPlanInput - The input type for the answerQuestionsAboutQPlan function.
 * - AnswerQuestionsAboutQPlanOutput - The return type for the answerQuestionsAboutQPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutQPlanInputSchema = z.object({
  question: z.string().describe('The question to answer about QPlan events and resources.'),
  eventDetails: z.string().describe('Details about upcoming events.'),
  resourceStatus: z.string().describe('Status and location of available resources.'),
});
export type AnswerQuestionsAboutQPlanInput = z.infer<typeof AnswerQuestionsAboutQPlanInputSchema>;

const AnswerQuestionsAboutQPlanOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about QPlan events and resources.'),
});
export type AnswerQuestionsAboutQPlanOutput = z.infer<typeof AnswerQuestionsAboutQPlanOutputSchema>;

export async function answerQuestionsAboutQPlan(input: AnswerQuestionsAboutQPlanInput): Promise<AnswerQuestionsAboutQPlanOutput> {
  return answerQuestionsAboutQPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsAboutQPlanPrompt',
  input: {schema: AnswerQuestionsAboutQPlanInputSchema},
  output: {schema: AnswerQuestionsAboutQPlanOutputSchema},
  prompt: `You are a chatbot for QPlan. Use the following information to answer the user's question about upcoming events and resource availability.\n\nQuestion: {{{question}}}\n\nEvent Details: {{{eventDetails}}}\n\nResource Status: {{{resourceStatus}}}\n\nAnswer: `,
});

const answerQuestionsAboutQPlanFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutQPlanFlow',
    inputSchema: AnswerQuestionsAboutQPlanInputSchema,
    outputSchema: AnswerQuestionsAboutQPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

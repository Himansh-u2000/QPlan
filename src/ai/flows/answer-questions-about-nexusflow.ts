'use server';
/**
 * @fileOverview A question answering AI agent for NexusFlow events and resources.
 *
 * - answerQuestionsAboutNexusFlow - A function that handles question answering about NexusFlow.
 * - AnswerQuestionsAboutNexusFlowInput - The input type for the answerQuestionsAboutNexusFlow function.
 * - AnswerQuestionsAboutNexusFlowOutput - The return type for the answerQuestionsAboutNexusFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutNexusFlowInputSchema = z.object({
  question: z.string().describe('The question to answer about NexusFlow events and resources.'),
  eventDetails: z.string().describe('Details about upcoming events.'),
  resourceStatus: z.string().describe('Status and location of available resources.'),
});
export type AnswerQuestionsAboutNexusFlowInput = z.infer<typeof AnswerQuestionsAboutNexusFlowInputSchema>;

const AnswerQuestionsAboutNexusFlowOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about NexusFlow events and resources.'),
});
export type AnswerQuestionsAboutNexusFlowOutput = z.infer<typeof AnswerQuestionsAboutNexusFlowOutputSchema>;

export async function answerQuestionsAboutNexusFlow(input: AnswerQuestionsAboutNexusFlowInput): Promise<AnswerQuestionsAboutNexusFlowOutput> {
  return answerQuestionsAboutNexusFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsAboutNexusFlowPrompt',
  input: {schema: AnswerQuestionsAboutNexusFlowInputSchema},
  output: {schema: AnswerQuestionsAboutNexusFlowOutputSchema},
  prompt: `You are a chatbot for NexusFlow. Use the following information to answer the user's question about upcoming events and resource availability.\n\nQuestion: {{{question}}}\n\nEvent Details: {{{eventDetails}}}\n\nResource Status: {{{resourceStatus}}}\n\nAnswer: `,
});

const answerQuestionsAboutNexusFlowFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutNexusFlowFlow',
    inputSchema: AnswerQuestionsAboutNexusFlowInputSchema,
    outputSchema: AnswerQuestionsAboutNexusFlowOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

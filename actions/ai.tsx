'use server';

import { ReactNode } from 'react';
import { openai } from '@ai-sdk/openai';
import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { nanoid } from 'nanoid';
import { AIResponse } from '../components/ai-response';

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  const history = getMutableAIState();

  const result = await streamUI({
    model: openai('gpt-4o'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);
      }
      return <AIResponse content={content} />;
    },
  });

  return {
    id: nanoid(),
    role: 'assistant',
    display: result.value,
  };
}

export const AIProvider = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});

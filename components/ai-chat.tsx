'use client';

import { useState } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { nanoid } from 'nanoid';
import { ClientMessage } from '../actions/ai';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const AIChat = () => {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setInput('');
    setIsLoading(true);
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: nanoid(), role: 'user', display: input },
    ]);

    try {
      const message = await continueConversation(input);
      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        message,
      ]);
    } catch (error) {
      console.error('Error in conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-xl w-full flex flex-col gap-2'>
      <div className='prose prose-sm dark:prose-invert'>
        {conversation.map((message: ClientMessage) => (
          <div
            key={message.id}
            className={cn(
              'group relative flex items-start gap-2 rounded-3xl p-2 lg:gap-4 lg:p-4',
              message.role !== 'assistant'
                ? 'bg-muted/50 ml-auto sm:max-w-[80%]'
                : 'bg-background mr-auto sm:max-w-[80%]'
            )}
          >
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.display}
          </div>
        ))}
      </div>
      <form className='flex w-full flex-col gap-2' onSubmit={handleSubmit}>
        <Textarea
          placeholder='Type your message...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className='w-full'
        />
        <Button
          className=''
          type='submit'
          disabled={!input.trim() || isLoading}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

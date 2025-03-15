'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface AIResponseProps {
  content: string;
}

export function AIResponse({ content }: AIResponseProps) {
  return (
    <div className='prose prose-sm dark:prose-invert max-w-none'>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

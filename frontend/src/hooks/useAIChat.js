import { useState } from 'react';
import { toast } from '../components/ui/Toast';

export function useAIChat() {
  const [isTyping] = useState(false);

  const sendMessage = async () => {
    toast.info('AI Financial Advisor is currently under development and coming soon.');
  };

  return { sendMessage, isTyping: false };
}

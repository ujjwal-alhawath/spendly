import React from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

export function Chat() {
  const clearChat = useStore(state => state.clearChat);
  const chatHistory = useStore(state => state.chatHistory);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full relative">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-lg font-semibold text-textPrimary">AI Advisor</h2>
        
        {chatHistory.length > 0 && (
          <Button 
            variant="ghost" 
            onClick={() => {
              if (window.confirm("Are you sure you want to clear the chat history?")) {
                clearChat();
              }
            }}
            className="text-muted hover:text-red-500"
          >
            Clear Chat
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <ChatWindow />
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import type { ChatMessage } from '../types';
import projectBackend from '../canister'; // Import the backend canister actor

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI health assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Call the backend's `askHealthQuestion` method
      const aiResponse = await projectBackend.askHealthQuestion('user123', input); // Replace 'user123' with the actual user ID
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling backend:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-500" />
          AI Health Assistant
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-3 mb-4 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`p-2 rounded-full ${
              message.sender === 'ai' 
                ? 'bg-blue-100 dark:bg-blue-900' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              {message.sender === 'ai' ? (
                <Bot className="w-6 h-6 text-blue-500 dark:text-blue-300" />
              ) : (
                <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
              )}
            </div>
            <div className={`flex-1 max-w-[80%] p-4 rounded-lg ${
              message.sender === 'ai'
                ? 'bg-white dark:bg-gray-800 shadow-md'
                : 'bg-blue-500 text-white'
            }`}>
              <p className={message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}>
                {message.content}
              </p>
              <span className="text-xs mt-2 block opacity-50">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send
          </motion.button>
        </div>
      </form>
    </div>
  );
};
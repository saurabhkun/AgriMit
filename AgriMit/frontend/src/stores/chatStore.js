import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  
  sendMessage: async (text, fieldContext = '') => {
    const { messages, isLoading } = get();
    if (isLoading) return;
    
    // Add user message
    set({ 
      messages: [...messages, { role: 'user', content: text, timestamp: new Date().toISOString() }],
      isLoading: true 
    });
    
    try {
      // Call API with context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          fieldContext,
          language: navigator.language.split('-')[0] || 'en' 
        })
      });
      
      const data = await response.json();
      set({ 
        messages: [...messages, { role: 'user', content: text, timestamp: new Date().toISOString() }, 
                   { role: 'assistant', content: data.response, timestamp: new Date().toISOString() }],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        messages: [...messages, { role: 'user', content: text, timestamp: new Date().toISOString() },
                   { role: 'assistant', content: 'Sorry, having trouble connecting. Check backend server?', timestamp: new Date().toISOString() }],
        isLoading: false 
      });
    }
  },
  
  clearChat: () => set({ messages: [] }),
}));


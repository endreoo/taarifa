import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import AiChat from '../chat/AiChat';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {children}

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Component */}
      <AiChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
} 
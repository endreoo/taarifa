import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, X, Mail, Phone } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface UserInfo {
  name: string;
  email: string;
  whatsapp: string;
}

interface AiChatProps {
  isOpen: boolean;
  onClose: () => void;
  rewardProgramId?: string;
}

export default function AiChat({ isOpen, onClose, rewardProgramId }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '', whatsapp: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // After 2 messages, prompt for user info
      if (messages.filter(m => m.sender === 'user').length === 1) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: "I'd love to help you more! To provide better assistance and continue our chat, could you please share your name, email, and WhatsApp number? You can also sign in if you already have an account.",
            sender: 'ai',
            timestamp: new Date()
          }]);
          setShowUserForm(true);
        }, 1000);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          rewardProgramId,
          userInfo,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        })
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.message,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUserForm(false);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: `Thanks ${userInfo.name}! I'll continue helping you now. What else would you like to know?`,
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  const handleSignIn = () => {
    window.location.href = '/api/nextcloud/auth/login';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl flex flex-col max-h-[600px] border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-amber-600" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-amber-600" />
            <p className="text-lg font-medium mb-2">Welcome to Taarifa Suites!</p>
            <p className="text-sm">How can I assist you today?</p>
          </div>
        )}
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-xs opacity-75">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* User Info Form */}
      {showUserForm && (
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleUserInfoSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={userInfo.whatsapp}
                onChange={(e) => setUserInfo(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700"
              >
                Continue Chat
              </button>
              <button
                type="button"
                onClick={handleSignIn}
                className="flex-1 bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700"
              >
                Sign In Instead
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Input */}
      {!showUserForm && (
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
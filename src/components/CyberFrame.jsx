import React, { useState, useEffect, useRef } from 'react';
import { Activity, Search, Timer } from 'lucide-react';

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[80%] px-4 py-2 rounded bg-[#001a1a] border border-cyan-400/20`}>
      <p className="text-cyan-400">{message}</p>
    </div>
  </div>
);

const TweetCard = ({ tweet }) => (
  <div className="mb-6 bg-[#001a1a] rounded border border-cyan-400/20 p-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-cyan-400">@{tweet.username}</span>
      <span className="text-cyan-400/50 text-sm">{tweet.time}</span>
    </div>
    <p className="text-white mb-2">{tweet.text}</p>
    <p className="text-cyan-400/70 text-sm">Sentiment: {tweet.sentiment}</p>
  </div>
);

const CyberFrame = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 600));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputMessage('');

    try {
      const response = await fetch('https://eliza-starter-07uw.onrender.com/ce5d1752-cd9c-0bc7-b5c8-119d95e47844/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage,
          userId: "user",
          userName: "User"
        }),
      });
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      // The response is an array with a message object
      if (Array.isArray(data) && data.length > 0) {
        const botMessage = data[0]; // Get first message from array
        setMessages(prev => [...prev, { 
          text: botMessage.text,
          isUser: false 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          text: "No response received", 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Connection error. Please try again.", 
        isUser: false 
      }]);
    }
  };

  const mockTweets = [
    { id: 1, username: "tech_observer", text: "Quantum computing breakthrough in silicon-based qubits", time: "2m ago", sentiment: "Positive" },
    { id: 2, username: "cyber_sentinel", text: "New cybersecurity protocols implemented across major networks", time: "5m ago", sentiment: "Neutral" },
    { id: 3, username: "ai_future", text: "Neural networks showing unexpected emergence patterns", time: "8m ago", sentiment: "Analytical" },
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="w-full h-[calc(100vh-4rem)] border border-cyan-400/30 bg-black">
        {/* Main content area */}
        <div className="h-full grid grid-cols-2 gap-4 p-8 relative">
          {/* Chat Section */}
          <div className="flex flex-col h-full relative overflow-hidden">
            <video
              className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
              src="/chat-background.mp4"
              autoPlay
              loop
              muted
            />
            <div className="flex items-center justify-between p-4 border-b border-cyan-400/20 relative z-10">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-cyan-400 mr-2" />
                <h2 className="text-cyan-400 text-lg font-normal">ELIZA Interface</h2>
              </div>
              <div className="text-cyan-400 text-sm">
                Contract: 0x1234...abcd
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 relative z-10">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg.text} isUser={msg.isUser} />
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 relative z-10">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#001a1a] border border-cyan-400/20 rounded px-4 py-2 text-cyan-400 focus:outline-none focus:border-cyan-400/50"
                  placeholder="Type your message..."
                />
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#001a1a] border border-cyan-400/20 text-cyan-400 rounded hover:bg-[#002a2a] transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Twitter Feed Section */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-cyan-400/20">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-cyan-400 mr-2" />
                <h2 className="text-cyan-400 text-lg font-normal">Feed Monitor</h2>
              </div>
              <div className="flex items-center">
                <Timer className="w-4 h-4 text-cyan-400 animate-pulse mr-2" />
                <span className="text-cyan-400 text-sm">{formatTime(timeLeft)}</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {mockTweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            </div>
          </div>

          {/* Fading Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default CyberFrame;
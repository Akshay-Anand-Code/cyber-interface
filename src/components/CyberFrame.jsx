import React, { useState, useEffect, useRef } from 'react';
import { Activity, Search, Timer } from 'lucide-react';
import StatusBars from './StatusBars';
import AiProtocolButton from './AiProtocolButton';
import { fetchUserTweets } from '../utils/twitterApi';
import { getChatResponse } from '../utils/openai';

// Keeping all original components exactly as they are
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
      <span className="text-cyan-400">@Aether_OnSol</span>
      <span className="text-cyan-400/50 text-sm">{tweet.time}</span>
    </div>
    <p className="text-white mb-2">{tweet.text}</p>
    <div className="flex gap-4 text-cyan-400/70 text-sm">
      <span>♥ {tweet.metrics?.like_count || 0}</span>
      <span>↺ {tweet.metrics?.retweet_count || 0}</span>
    </div>
  </div>
);

const ContractAddress = () => {
  const [copied, setCopied] = useState(false);
  const fullAddress = "";
  const truncatedAddress = `${fullAddress.slice(0, 6)}...${fullAddress.slice(-6)}`;

  const copyToClipboard = () => {
    // Use the Clipboard API
    navigator.clipboard.writeText(fullAddress)
      .then(() => {
        setCopied(true);
        // Reset the "Copied!" message after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="relative">
      <div 
        onClick={copyToClipboard}
        className="text-cyan-400 text-sm cursor-pointer hover:text-cyan-300 transition-colors"
        title="Click to copy full address"
      >
        Contract: {truncatedAddress}
      </div>
      
      {/* Copied notification */}
      {copied && (
        <div className="absolute -top-8 right-0 bg-[#001a1a] border border-cyan-400/20 px-2 py-1 rounded text-cyan-400 text-xs">
          Copied!
        </div>
      )}
    </div>
  );
};

const CyberFrame = () => {
  // Keeping all the original state and effects
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const chatEndRef = useRef(null);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getTweets = async () => {
      const fetchedTweets = await fetchUserTweets();
      if (fetchedTweets.length > 0) {
        setTweets(fetchedTweets);
      }
    };
    getTweets();
    const interval = setInterval(getTweets, 15 * 60 * 1000);
    return () => clearInterval(interval);
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
      const response = await getChatResponse(userMessage);
      setMessages(prev => [...prev, { 
        text: response,
        isUser: false 
      }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { 
        text: "Neural connection error. Please try again.", 
        isUser: false 
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="w-full h-[calc(100vh-3rem)] border border-cyan-400/30 bg-black">
        {/* Main content area */}
        <div className="h-full grid grid-cols-[auto_1fr_1fr] gap-4 p-6 relative">
          {/* Status Bars Section */}
          <StatusBars />

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
                <img 
                  src="/aether.png" 
                  alt="Aether" 
                  className="w-6 h-6 mr-2"
                />
                <span className="text-cyan-400 text-lg">AETHER Interface</span>
              </div>
              <ContractAddress />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 relative z-10">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg.text} isUser={msg.isUser} />
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 pb-8 relative z-10">
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
                <span className="text-cyan-400 text-sm mr-4">{formatTime(timeLeft)}</span>
                <AiProtocolButton />
              </div>
            </div>
            
            <div className="flex flex-col h-full justify-between">
              {/* Tweets container with fixed height */}
              <div className="p-4 h-[calc(100%-6rem)]">
                {tweets.slice(0, 2).map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))}
                {tweets.length === 0 && (
                  <div className="text-cyan-400/50 text-center py-4">
                    Loading tweets...
                  </div>
                )}
              </div>
              
              {/* Signal video fixed at bottom */}
              <div className="h-24">
                <div className="relative inset-0 bg-cyan-400/20 mix-blend-overlay z-10"></div>
                <video
                  className="w-full h-24 object-cover bg-cyan-400/20"
                  src="/signal.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>

          {/* Fading Lines */}
          <div className="absolute top-0 bottom-0 left-[calc(264px+1.5rem)] w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
          <div className="absolute top-0 bottom-0 left-[calc(50%+132px)] w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default CyberFrame;
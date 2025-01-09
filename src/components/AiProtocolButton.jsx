import React, { useState } from 'react';
import { X } from 'lucide-react';

const AiProtocolButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      {/* Button */}
      <button
        onClick={toggleModal}
        className="px-4 py-2 bg-transparent border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 rounded"
      >
        AI CREATION PROTOCOL
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-[#001a1a] border border-cyan-400/30 rounded-lg p-6 relative">
            {/* Close button */}
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-cyan-400/70 hover:text-cyan-400"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6 border-b border-cyan-400/20 pb-4">
              <h2 className="text-cyan-400 text-xl">AUTHORIZED PERSONNEL ONLY</h2>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-cyan-400 text-2xl mb-4">COMING SOON</h3>
              <p className="text-cyan-400/70 leading-relaxed">
                Create and share your own AI. Customize its instructions, goals, and
                personality, and watch it change based on how others interact with
                it. Earn $AETHER with every interaction your AI has.
              </p>

              {/* Status Section */}
              <div className="mt-6 p-4 bg-black/30 border border-cyan-400/20 rounded">
                <div className="flex justify-between items-center text-cyan-400/60 text-sm">
                  <span>Initialization Status</span>
                  <span>PENDING</span>
                </div>
                <div className="mt-2 h-1 bg-black/50 rounded overflow-hidden">
                  <div className="h-full w-1/3 bg-cyan-400/50 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiProtocolButton;
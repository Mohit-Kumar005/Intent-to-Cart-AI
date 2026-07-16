import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

function IntentInput({ onSubmit }) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => { if (textareaRef.current) textareaRef.current.focus(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) { onSubmit(input.trim()); setInput(''); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-8">
      <div className={`relative rounded-2xl transition-all duration-300 ${isFocused ? 'shadow-xl shadow-amazon-orange/20 ring-2 ring-amazon-orange/50' : 'shadow-lg hover:shadow-xl'}`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder='Try: "Baby has fever" or "Friends coming over in 30 mins" or "Power cut at home"'
          rows={3}
          className="w-full px-6 py-5 pr-24 text-lg rounded-2xl border-0 resize-none focus:outline-none bg-white text-gray-800 placeholder-gray-400"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button type="submit" disabled={!input.trim()} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${input.trim() ? 'amazon-gradient text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
            <Send className="w-4 h-4" /><span>Go</span>
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">Describe your situation naturally. No need to search for products.</p>
    </form>
  );
}

export default IntentInput;

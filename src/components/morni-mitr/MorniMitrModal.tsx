import React, { useState } from 'react';
import { Sparkles, X, Send, BookOpen, Lightbulb, Compass, RotateCcw, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

interface MorniMitrModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLessonTitle?: string;
  topic?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function MorniMitrModal({ isOpen, onClose, activeLessonTitle, topic }: MorniMitrModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Namaste! I am **Morni Mitr**, your creative learning mentor. I can help explain tricky concepts, summarize lessons, give you step-by-step thinking hints, or suggest hands-on practice. What are you exploring today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'explain' | 'summarize' | 'hint' | 'practice'>('explain');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingDaily, setRemainingDaily] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch<{ reply: string; remainingToday: number }>('/api/ai/morni-mitr', {
        method: 'POST',
        body: JSON.stringify({
          prompt: userMessage.content,
          mode,
          lessonTitle: activeLessonTitle,
          topic,
        }),
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setRemainingDaily(res.remainingToday);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to Morni Mitr right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string, chosenMode: 'explain' | 'summarize' | 'hint' | 'practice') => {
    setMode(chosenMode);
    setInput(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[620px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg text-white border border-white/30">
              🦚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg tracking-tight">MORNI MITR</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/25 text-white">
                  AI Mentor
                </span>
              </div>
              <p className="text-xs text-amber-100">
                {activeLessonTitle ? `Context: ${activeLessonTitle}` : 'Creative Learning Companion'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white/90 hover:text-white transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Chips */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mr-1">
            Focus:
          </span>
          <button
            type="button"
            onClick={() => setMode('explain')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              mode === 'explain'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Explain Concept
          </button>
          <button
            type="button"
            onClick={() => setMode('hint')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              mode === 'hint'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" /> Give a Hint
          </button>
          <button
            type="button"
            onClick={() => setMode('summarize')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              mode === 'summarize'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Summarize
          </button>
          <button
            type="button"
            onClick={() => setMode('practice')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              mode === 'practice'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Practice Challenge
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  🦚
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs italic">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center animate-pulse">
                🦚
              </div>
              <span>Morni Mitr is formulating helpful analogies and insights...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap">Try asking:</span>
          <button
            type="button"
            onClick={() => handleQuickPrompt('Why is WCAG 4.5:1 contrast essential in design?', 'explain')}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-amber-700 hover:border-amber-300 transition whitespace-nowrap"
          >
            "Why is 4.5:1 contrast essential?"
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrompt('Give me a hint on calculating the 8pt grid padding', 'hint')}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-amber-700 hover:border-amber-300 transition whitespace-nowrap"
          >
            "Hint on 8pt grid"
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrompt('What is a quick exercise to practice squash and stretch?', 'practice')}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-amber-700 hover:border-amber-300 transition whitespace-nowrap"
          >
            "Practice squash & stretch"
          </button>
        </div>

        {/* Footer Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Morni Mitr a question about design, code, or your project..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-50 transition"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

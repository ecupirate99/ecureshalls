/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Send, User, Bot, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClear = () => {
    setQuestion('');
    setAnswer('');
    setError(null);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');

    try {
      const resp = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question })
      });
      const data = await resp.json();
      const output = data?.data?.[0];
      setAnswer(typeof output === 'string' ? output : JSON.stringify(output, null, 2));
    } catch (err) {
      console.error('Error calling proxy API:', err);
      setError('Sorry, there was an error fetching the answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header - ECU Styled */}
      <header className="bg-[#592a8a] text-white py-6 px-4 shadow-md border-b-4 border-[#fec923]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <Bot className="w-8 h-8 text-[#592a8a]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight uppercase">ECU Housing</h1>
              <p className="text-sm font-medium text-[#fec923]">Residence Hall AI Chatbot</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        {/* Intro Section */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-[#592a8a] mb-2">How can we help you today?</h2>
          <p className="text-gray-600 leading-relaxed">
            Ask anything about our neighborhoods, residence halls, amenities, or living on campus at East Carolina University.
          </p>
        </section>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="textbox-user-question" className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Your Question
              </label>
              <button
                onClick={handleClear}
                className="text-xs font-medium text-gray-500 hover:text-[#592a8a] flex items-center gap-1 transition-colors"
                title="Clear input and response"
              >
                <Trash2 className="w-3 h-3" />
                Clear Chat
              </button>
            </div>
            <div className="relative">
              <textarea
                id="textbox-user-question"
                className="w-full p-4 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#592a8a] focus:border-[#592a8a] transition-all resize-none min-h-[120px] text-gray-800"
                placeholder="e.g., Tell me about the West End neighborhood..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskQuestion();
                  }
                }}
              />
              <button
                onClick={handleAskQuestion}
                disabled={isLoading || !question.trim()}
                className="absolute bottom-3 right-3 p-3 bg-[#592a8a] text-white rounded-full hover:bg-[#45206b] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
                aria-label="Send question"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="p-6 min-h-[200px] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#fec923] p-1.5 rounded-md">
                <Bot className="w-5 h-5 text-[#592a8a]" />
              </div>
              <h3 className="font-bold text-[#592a8a] uppercase text-sm tracking-widest">Response</h3>
            </div>

            <div id="text-output-answer" className="flex-grow">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-8"
                  >
                    <Loader2 className="w-10 h-10 animate-spin text-[#592a8a]" />
                    <p className="animate-pulse">Searching ECU Housing resources...</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
                  >
                    {error}
                  </motion.div>
                ) : answer ? (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-purple max-w-none text-gray-800 leading-relaxed"
                  >
                    {answer.split('\n').map((line, i) => (
                      <p key={i} className="mb-4 last:mb-0">{line}</p>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-gray-400 italic py-8"
                  >
                    <p>Your answer will appear here.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8 px-4 text-center mt-auto">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 mb-2 font-medium">ECU Housing & Residence Life</p>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Created by Quintin G.- All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

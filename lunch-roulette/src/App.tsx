import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, RotateCw, Utensils, Sparkles, ChevronRight, X } from 'lucide-react';
import * as d3 from 'd3';
import { DEFAULT_LUNCH_ITEMS, CATEGORIES } from './lunchConstants';

interface MenuItem {
  id: string;
  name: string;
  color: string;
}

export default function App() {
  const [items, setItems] = useState<MenuItem[]>(DEFAULT_LUNCH_ITEMS);
  const [newItemName, setNewItemName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<MenuItem | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  
  const wheelRef = useRef<SVGSVGElement>(null);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  const addItem = (name: string) => {
    if (!name.trim()) return;
    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      color: colors(items.length.toString()),
    };
    setItems([...items, newItem]);
    setNewItemName('');
  };

  const removeItem = (id: string) => {
    if (items.length <= 2) return;
    setItems(items.filter(item => item.id !== id));
  };

  const spin = () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setResult(null);
    
    // Calculate a random rotation
    const extraSpins = 5 + Math.random() * 5; // 5 to 10 full spins
    const newRotation = rotation + extraSpins * 360 + Math.random() * 360;
    setRotation(newRotation);

    // Determine the result based on the final rotation
    setTimeout(() => {
      const actualRotation = newRotation % 360;
      const sliceAngle = 360 / items.length;
      // The needle is at the top (0 degrees). 
      // The wheel rotates clockwise. 
      // So the item at the top is the one that was at (360 - actualRotation) initially.
      const index = Math.floor(((360 - (actualRotation % 360)) % 360) / sliceAngle);
      const winner = items[index];
      
      setResult(winner);
      setIsSpinning(false);
      setShowResultModal(true);
    }, 4000); // Match the CSS transition duration
  };

  // D3 Wheel Rendering
  useEffect(() => {
    if (!wheelRef.current || items.length === 0) return;

    const svg = d3.select(wheelRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<MenuItem>().value(1).sort(null);
    const arc = d3.arc<d3.PieArcDatum<MenuItem>>()
      .innerRadius(0)
      .outerRadius(radius);

    const slices = g.selectAll(".slice")
      .data(pie(items))
      .enter()
      .append("g")
      .attr("class", "slice");

    slices.append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "white")
      .attr("stroke-width", "2px");

    slices.append("text")
      .attr("transform", (d) => {
        const centroid = arc.centroid(d);
        const angle = (d.startAngle + d.endAngle) / 2;
        const rotate = (angle * 180 / Math.PI) - 90;
        return `translate(${centroid[0] * 1.5}, ${centroid[1] * 1.5}) rotate(${rotate})`;
      })
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", items.length > 10 ? "12px" : "16px")
      .text((d) => d.data.name);

  }, [items]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-indigo-100">
      {/* Header Section */}
      <header className="pt-12 pb-8 px-6 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4"
        >
          <Utensils size={14} />
          <span>Lunch Decision Maker</span>
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none mb-4">
          LUNCH <span className="text-indigo-600">ROULETTE</span>
        </h1>
        <p className="text-stone-500 max-w-md mx-auto font-medium">
          Can't decide what to eat? Add your favorite spots and let the wheel choose your destiny.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 pb-24 items-start">
        {/* Left: Roulette Wheel */}
        <div className="flex flex-col items-center justify-center space-y-8 sticky top-12">
          <div className="relative">
            {/* Needle */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-8 h-8 text-indigo-600 drop-shadow-lg">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21l-8-14h16l-8 14z" />
              </svg>
            </div>
            
            {/* Wheel Container */}
            <div className="rounded-full border-8 border-white shadow-2xl overflow-hidden bg-white">
              <svg 
                ref={wheelRef} 
                width="400" 
                height="400" 
                viewBox="0 0 400 400"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
                }}
              />
            </div>

            {/* Center Button */}
            <button
              onClick={spin}
              disabled={isSpinning}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all active:scale-90 ${
                isSpinning ? 'bg-stone-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <RotateCw className={isSpinning ? 'animate-spin' : ''} size={32} />
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Ready to eat?</p>
            <button
              onClick={spin}
              disabled={isSpinning}
              className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all disabled:opacity-50"
            >
              SPIN THE WHEEL
            </button>
          </div>
        </div>

        {/* Right: Menu Management */}
        <div className="space-y-8">
          {/* Add Item */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Plus className="text-indigo-600" size={20} />
              Add Menu Item
            </h2>
            <form 
              onSubmit={(e) => { e.preventDefault(); addItem(newItemName); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter menu name..."
                className="flex-1 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Add
              </button>
            </form>

            <div className="mt-6">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Quick Add Categories</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      const randomItem = cat.items[Math.floor(Math.random() * cat.items.length)];
                      addItem(randomItem);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200 transition-all"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Item List */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold">Menu List</h2>
              <span className="text-xs font-bold bg-stone-100 px-2 py-1 rounded-md text-stone-500">
                {items.length} Items
              </span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 group"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-bold text-stone-700">{item.name}</span>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 2}
                      className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg disabled:opacity-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* Result Modal */}
      <AnimatePresence>
        {showResultModal && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] p-12 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <Sparkles size={48} />
                </div>
                
                <p className="text-stone-400 font-bold uppercase tracking-[0.2em] text-xs mb-2">Today's Choice is...</p>
                <h2 className="text-5xl font-display font-black text-stone-900 mb-8 tracking-tight">
                  {result.name}
                </h2>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 text-lg"
                  >
                    맛있게 드세요! (Enjoy!)
                  </button>
                  <button
                    onClick={() => { setShowResultModal(false); spin(); }}
                    className="w-full py-4 text-stone-400 font-bold hover:text-stone-600 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCw size={16} />
                    한 번 더 돌리기 (Spin Again)
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setShowResultModal(false)}
                className="absolute top-6 right-6 p-2 text-stone-300 hover:text-stone-600 transition-all"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}

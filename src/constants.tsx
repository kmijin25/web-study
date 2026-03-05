import { 
  Ghost, 
  Zap, 
  Heart, 
  Star, 
  Moon, 
  Sun, 
  Cloud, 
  Anchor, 
  Coffee, 
  Gift, 
  Music, 
  Camera, 
  Pizza, 
  Rocket, 
  Smile, 
  Target,
  Flame,
  Leaf
} from 'lucide-react';

export const CARD_ICONS = [
  { id: 'ghost', Icon: Ghost, color: 'text-purple-500' },
  { id: 'zap', Icon: Zap, color: 'text-yellow-500' },
  { id: 'heart', Icon: Heart, color: 'text-red-500' },
  { id: 'star', Icon: Star, color: 'text-amber-500' },
  { id: 'moon', Icon: Moon, color: 'text-indigo-500' },
  { id: 'sun', Icon: Sun, color: 'text-orange-500' },
  { id: 'cloud', Icon: Cloud, color: 'text-sky-500' },
  { id: 'anchor', Icon: Anchor, color: 'text-blue-700' },
  { id: 'coffee', Icon: Coffee, color: 'text-amber-800' },
  { id: 'gift', Icon: Gift, color: 'text-pink-500' },
  { id: 'music', Icon: Music, color: 'text-rose-500' },
  { id: 'camera', Icon: Camera, color: 'text-slate-600' },
  { id: 'pizza', Icon: Pizza, color: 'text-orange-600' },
  { id: 'rocket', Icon: Rocket, color: 'text-blue-500' },
  { id: 'smile', Icon: Smile, color: 'text-yellow-400' },
  { id: 'target', Icon: Target, color: 'text-red-600' },
  { id: 'flame', Icon: Flame, color: 'text-orange-700' },
  { id: 'leaf', Icon: Leaf, color: 'text-emerald-500' },
];

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTIES: Record<Difficulty, { pairs: number; grid: string }> = {
  easy: { pairs: 6, grid: 'grid-cols-3 md:grid-cols-4' },
  medium: { pairs: 10, grid: 'grid-cols-4 md:grid-cols-5' },
  hard: { pairs: 15, grid: 'grid-cols-5 md:grid-cols-6' },
};

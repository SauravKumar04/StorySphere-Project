import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  PenSquare, 
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();


const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Stories', href: '/stories', icon: BookOpen },
  { name: 'Create Story', href: '/create-story', icon: PenSquare },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Trending', href: '/trending', icon: TrendingUp },
];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white/70 backdrop-blur-lg border-r border-white/20 h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            StorySphere
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-pink-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                active ? 'text-white' : 'text-gray-400 group-hover:text-pink-500'
              }`} />
              <span className="font-medium">{item.name}</span>
              {item.name === 'Create Story' && (
                <Sparkles className="w-4 h-4 ml-auto text-yellow-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mt-8">
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white">
          <h3 className="font-semibold text-sm opacity-90 mb-2">Writing Streak</h3>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">7 days</div>
              <div className="text-sm opacity-90">Keep going!</div>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
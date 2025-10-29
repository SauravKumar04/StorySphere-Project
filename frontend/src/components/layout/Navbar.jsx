import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  LogOut,
  Settings,
  BookMarked
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/70 backdrop-blur-lg border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stories, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Link 
            to="/notifications"
            className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Link>

          {/* Library */}
          <Link 
            to="/library"
            className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
          >
            <BookMarked className="w-6 h-6" />
          </Link>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-white/50 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700 hidden sm:block">
                {user?.username}
              </span>
            </Menu.Button>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-1 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-1 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 py-2 z-50">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`flex items-center px-4 py-3 text-sm ${
                        active ? 'bg-pink-50 text-pink-600' : 'text-gray-700'
                      }`}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={`flex items-center px-4 py-3 text-sm ${
                        active ? 'bg-pink-50 text-pink-600' : 'text-gray-700'
                      }`}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <div className="border-t border-gray-200 my-1"></div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full px-4 py-3 text-sm ${
                        active ? 'bg-pink-50 text-pink-600' : 'text-gray-700'
                      }`}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
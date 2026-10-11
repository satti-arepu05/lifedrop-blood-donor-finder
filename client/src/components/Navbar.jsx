import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Droplet, 
  Sun, 
  Moon, 
  Languages, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  AlertCircle,
  Search,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lifedrop_lang', lang);
    setLangMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-redDark via-brand-red to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform duration-300">
              <Droplet className="w-6 h-6 fill-white drop-shadow-sm animate-pulse-slow" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Life<span className="text-brand-red">Drop</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-brand-red dark:text-red-400">
                  24x7
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                Blood Donor Finder
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/') 
                  ? 'text-brand-red dark:text-red-400 bg-red-50 dark:bg-red-950/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/find-donor"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/find-donor') 
                  ? 'text-brand-red dark:text-red-400 bg-red-50 dark:bg-red-950/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('nav.findDonor')}
            </Link>
            <Link
              to="/request-blood"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/request-blood') 
                  ? 'text-brand-red dark:text-red-400 bg-red-50 dark:bg-red-950/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('nav.emergencyRequest')}
            </Link>
            <Link
              to="/data"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/data') 
                  ? 'text-brand-red dark:text-red-400 bg-red-50 dark:bg-red-950/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('nav.sampleData')}
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/about') 
                  ? 'text-brand-red dark:text-red-400 bg-red-50 dark:bg-red-950/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/contact') 
                  ? 'text-brand-red dark:text-red-400 bg-red-50 dark:bg-red-950/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Right Controls: Theme + Language + Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-label="Select language"
                className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 text-xs font-bold uppercase transition-colors"
              >
                <Languages className="w-4 h-4 text-brand-red" />
                <span>{i18n.language || 'en'}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-brand-red flex items-center justify-between"
                  >
                    <span>English</span>
                    <span className="text-[10px] text-slate-400">EN</span>
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-brand-red flex items-center justify-between"
                  >
                    <span>हिंदी</span>
                    <span className="text-[10px] text-slate-400">HI</span>
                  </button>
                  <button
                    onClick={() => handleLanguageChange('te')}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-brand-red flex items-center justify-between"
                  >
                    <span>తెలుగు</span>
                    <span className="text-[10px] text-slate-400">TE</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {role === 'donor' && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-950/40 text-brand-red dark:text-red-400 hover:bg-red-100 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Donor Portal</span>
                  </Link>
                )}
                {role === 'hospital' && (
                  <Link
                    to="/hospital"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 hover:bg-blue-100 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Hospital Portal</span>
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 max-w-[120px] truncate">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-red hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register-donor"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-brand-red hover:bg-brand-redHover text-white shadow-md shadow-red-500/20 hover:scale-[1.02] transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('nav.registerDonor')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-slate-900"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/find-donor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-slate-900"
          >
            {t('nav.findDonor')}
          </Link>
          <Link
            to="/request-blood"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-brand-red dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-slate-900"
          >
            {t('nav.emergencyRequest')}
          </Link>
          <Link
            to="/data"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-slate-900"
          >
            {t('nav.sampleData')}
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-slate-900"
          >
            {t('nav.about')}
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-slate-900"
          >
            {t('nav.contact')}
          </Link>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase">Language</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${i18n.language === 'en' ? 'bg-brand-red text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${i18n.language === 'hi' ? 'bg-brand-red text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  HI
                </button>
                <button
                  onClick={() => handleLanguageChange('te')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${i18n.language === 'te' ? 'bg-brand-red text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  TE
                </button>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="space-y-2">
                {role === 'donor' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 rounded-xl font-bold bg-brand-red text-white"
                  >
                    Donor Dashboard
                  </Link>
                )}
                {role === 'hospital' && (
                  <Link
                    to="/hospital"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 rounded-xl font-bold bg-brand-blue text-white"
                  >
                    Hospital Dashboard
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 rounded-xl font-bold bg-purple-600 text-white"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-center py-2.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Log Out ({user?.name})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register-donor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl font-bold bg-brand-red text-white shadow-md"
                >
                  {t('nav.registerDonor')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

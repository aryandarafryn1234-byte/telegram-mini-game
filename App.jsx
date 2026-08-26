import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApexGiftApp() {
    const [user, setUser] = useState({
        username: 'Guest',
        balance: 100,
        spinsLeft: 3
    });
    const [reward, setReward] = useState(null);
    const [isOpening, setIsOpening] = useState(false);
    const [activeTab, setActiveTab] = useState('gift'); // gift | tasks | invite | wallet

    useEffect(() => {
        // Initialize Telegram Web App SDK
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    }, []);

    const handleOpenGift = async () => {
        if (user.spinsLeft <= 0 || isOpening) return;
        setIsOpening(true);
        setReward(null);

        setTimeout(() => {
            // Simulated server response
            const won = [20, 50, 100, 250][Math.floor(Math.random() * 4)];
            setUser(prev => ({
                ...prev,
                balance: prev.balance + won,
                spinsLeft: prev.spinsLeft - 1
            }));
            setReward(won);
            setIsOpening(false);
            
            // Telegram Haptic Feedback
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans select-none pb-20">
            {/* Header / Stats */}
            <div className="p-4 flex justify-between items-center bg-slate-900/60 backdrop-blur-md border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-bold text-slate-950">
                        🎁
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold leading-tight">Apex Gifts</h1>
                        <p className="text-xs text-slate-400">@{user.username}</p>
                    </div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="text-yellow-400">🪙</span>
                    <span className="font-bold text-sm text-yellow-400">{user.balance.toLocaleString()}</span>
                </div>
            </div>

            {/* Main Interactive Screen */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                {activeTab === 'gift' && (
                    <div className="flex flex-col items-center w-full max-w-xs">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Available Keys: <span className="text-amber-400">{user.spinsLeft}</span>
                        </div>

                        {/* Gift Box Container */}
                        <motion.div 
                            animate={isOpening ? { scale: [1, 1.15, 0.95, 1.05, 1], rotate: [0, -8, 8, -8, 0] } : {}}
                            transition={{ duration: 0.8, repeat: isOpening ? Infinity : 0 }}
                            className="relative w-44 h-44 my-6 flex items-center justify-center cursor-pointer"
                            onClick={handleOpenGift}
                        >
                            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative text-8xl drop-shadow-2xl">
                                🎁
                            </div>
                        </motion.div>

                        {/* Reward Notification */}
                        <AnimatePresence>
                            {reward && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-amber-400 font-extrabold text-xl mb-4"
                                >
                                    + {reward} COINS! 🎉
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Button */}
                        <button
                            onClick={handleOpenGift}
                            disabled={user.spinsLeft <= 0 || isOpening}
                            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-md transition-all shadow-lg ${
                                user.spinsLeft > 0 
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 active:scale-95 shadow-amber-500/20 hover:brightness-110' 
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            {isOpening ? 'Opening Gift Box...' : user.spinsLeft > 0 ? 'OPEN GIFT BOX' : 'No Keys Left'}
                        </button>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="w-full max-w-sm space-y-3">
                        <h2 className="text-lg font-bold text-left mb-3">Earn More Keys</h2>
                        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-sm font-semibold">Join Telegram Channel</p>
                                <p className="text-xs text-amber-400">+1 Key & 50 Coins</p>
                            </div>
                            <button className="px-4 py-1.5 bg-blue-600 rounded-lg text-xs font-semibold">Join</button>
                        </div>
                        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-sm font-semibold">Daily Check-in</p>
                                <p className="text-xs text-amber-400">+2 Keys</p>
                            </div>
                            <button className="px-4 py-1.5 bg-emerald-600 rounded-lg text-xs font-semibold">Claim</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 flex justify-around p-3">
                {[
                    { id: 'gift', label: 'Gifts', icon: '🎁' },
                    { id: 'tasks', label: 'Tasks', icon: '⚡' },
                    { id: 'invite', label: 'Friends', icon: '👥' },
                    { id: 'wallet', label: 'Wallet', icon: '💳' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-1 text-xs font-medium ${
                            activeTab === tab.id ? 'text-amber-400' : 'text-slate-400'
                        }`}
                    >
                        <span className="text-lg">{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
      }
                  

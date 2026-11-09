import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { DailyQuestBanner } from './components/DailyQuestBanner';
import { MentorChatView } from './components/MentorChatView';
import { SpeakingBuddyView } from './components/SpeakingBuddyView';
import { SrsFlashcardsView } from './components/SrsFlashcardsView';
import { OcrScannerView } from './components/OcrScannerView';
import { PvpArenaView } from './components/PvpArenaView';
import { DashboardView } from './components/DashboardView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GLOBAL_SUCCESS_UNITS, UnitData, VocabularyItem } from './data/unitsData';
import { UserProgress } from './types';
import { sounds } from './utils/speechUtils';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'global_success_8_user_progress';

const INITIAL_PROGRESS: UserProgress = {
  level: 3,
  levelTitle: 'Chiến Binh Từ Vựng 8',
  xp: 320,
  xpToNextLevel: 500,
  streak: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyGoalWords: 5,
  wordsReviewedToday: 3,
  completedSpeakingToday: 0,
  pvpWins: 4,
  pvpTotal: 5,
  badges: [
    { id: 'b1', name: 'Nhà Thám Hiểm Trẻ', description: 'Bắt đầu hành trình chinh phục Global Success 8', icon: '🧭' },
    { id: 'b2', name: 'Chiến Binh Chuỗi 3', description: 'Học tập liên tiếp 3 ngày không gián đoạn', icon: '🔥' },
    { id: 'b3', name: 'Thợ Săn IPA Chuẩn', description: 'Đạt điểm phát âm trên 85% trong Speaking Buddy', icon: '🎙️' },
    { id: 'b4', name: 'Đấu Sĩ Tân Binh', description: 'Chiến thắng trận đấu đầu tiên trong Đấu Trường PvP', icon: '⚔️' },
  ],
  items: [
    { id: 'i1', name: 'Bình Hồi Phục HP', description: 'Hồi 50 HP trong trận Đấu trường PvP', icon: '🧪', count: 2 },
    { id: 'i2', name: 'Vé Nhân Đôi XP', description: 'Nhân đôi XP nhận được trong 30 phút', icon: '⚡', count: 1 },
    { id: 'i3', name: 'Khiên Bảo Vệ Streak', description: 'Bảo vệ chuỗi ngày nếu lỡ quên học 1 ngày', icon: '🛡️', count: 1 },
  ],
};

export default function App() {
  const [currentUnit, setCurrentUnit] = useState<UnitData>(GLOBAL_SUCCESS_UNITS[0]);
  const [activeTab, setActiveTab] = useState<'mentor' | 'speaking' | 'flashcards' | 'ocr' | 'pvp' | 'dashboard'>('mentor');
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read user progress from localStorage', e);
    }
    return INITIAL_PROGRESS;
  });

  // Calculate due words across all units
  const dueWordsCount = GLOBAL_SUCCESS_UNITS.reduce(
    (acc, u) => acc + u.vocabularies.filter((v) => v.dueStatus === 'due_now').length,
    0
  );

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch (e) {
      console.warn('Could not save user progress', e);
    }
  }, [userProgress]);

  // Handler for XP addition & Level calculation
  const handleAddXp = (amount: number) => {
    setUserProgress((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;
      let newTitle = prev.levelTitle;

      if (newXp >= prev.xpToNextLevel) {
        newLevel += 1;
        newXpToNext = Math.round(prev.xpToNextLevel * 1.5);
        sounds.playStreak();
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.4 },
        });

        if (newLevel >= 5) newTitle = 'Bậc Thầy Global Success 8';
        else if (newLevel >= 4) newTitle = 'Chuyên Gia Ngữ Pháp & IPA';
        else newTitle = 'Chiến Binh Từ Vựng 8';
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        levelTitle: newTitle,
        xpToNextLevel: newXpToNext,
        wordsReviewedToday: prev.wordsReviewedToday + 1,
      };
    });
  };

  const handleUpdateWordStatus = (wordId: string, status: 'due_now' | 'learning' | 'mastered', days: number) => {
    // Update local word state
    for (const unit of GLOBAL_SUCCESS_UNITS) {
      const word = unit.vocabularies.find((v) => v.id === wordId);
      if (word) {
        word.dueStatus = status;
        word.srsInterval = days;
        break;
      }
    }
    setUserProgress((prev) => ({
      ...prev,
      wordsReviewedToday: prev.wordsReviewedToday + 1,
    }));
  };

  const handleAddCustomVocabularies = (newWords: VocabularyItem[]) => {
    // Add to current unit
    currentUnit.vocabularies.unshift(...newWords);
    setCurrentUnit({ ...currentUnit });
  };

  const handleCompleteSpeaking = () => {
    setUserProgress((prev) => ({
      ...prev,
      completedSpeakingToday: prev.completedSpeakingToday + 1,
    }));
  };

  const handleRecordPvpResult = (won: boolean) => {
    setUserProgress((prev) => ({
      ...prev,
      pvpTotal: prev.pvpTotal + 1,
      pvpWins: won ? prev.pvpWins + 1 : prev.pvpWins,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <HeaderNav
        currentUnit={currentUnit}
        onSelectUnit={setCurrentUnit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProgress={userProgress}
      />

      {/* Daily Quest & Golden Review Banner */}
      <DailyQuestBanner
        userProgress={userProgress}
        dueWordsCount={dueWordsCount}
        onOpenSrs={() => setActiveTab('flashcards')}
        onOpenSpeaking={() => setActiveTab('speaking')}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'mentor' && (
          <MentorChatView
            currentUnit={currentUnit}
            userProgress={userProgress}
            onAddXp={handleAddXp}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'speaking' && (
          <SpeakingBuddyView
            currentUnit={currentUnit}
            userProgress={userProgress}
            onAddXp={handleAddXp}
            onCompleteSpeaking={handleCompleteSpeaking}
          />
        )}

        {activeTab === 'flashcards' && (
          <SrsFlashcardsView
            currentUnit={currentUnit}
            userProgress={userProgress}
            onUpdateWordStatus={handleUpdateWordStatus}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'ocr' && (
          <OcrScannerView
            userProgress={userProgress}
            onAddCustomVocabularies={handleAddCustomVocabularies}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'pvp' && (
          <PvpArenaView
            currentUnit={currentUnit}
            userProgress={userProgress}
            onAddXp={handleAddXp}
            onRecordPvpResult={handleRecordPvpResult}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            userProgress={userProgress}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>
          Global Success 8 AI Mentor • Cùng AI Chinh Phục Tiếng Anh 8 (NXB Giáo dục Việt Nam)
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Tích hợp Thuật toán Spaced Repetition (SRS) • AI Speaking Buddy 3 Tiêu Chí • OCR Trích Xuất SGK • Đấu Trường PvP
        </p>
      </footer>
    </div>
  );
}

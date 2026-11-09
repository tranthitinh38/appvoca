import React from 'react';
import { AssignmentHub } from './AssignmentHub';
import { UserProgress } from '../types';

interface TeacherDashboardProps {
  classStudents: UserProgress[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ classStudents }) => {
  // Compute class overview metrics
  const totalStudents = classStudents.length;
  const avgStreak =
    totalStudents === 0
      ? 0
      : Math.round(
          classStudents.reduce((sum, s) => sum + (s.streak ?? 0), 0) / totalStudents
        );
  const avgCompletion =
    totalStudents === 0
      ? 0
      : Math.round(
          classStudents.reduce((sum, s) => sum + (s.wordsReviewedToday ?? 0), 0) /
            totalStudents
        );
  const avgIpaScore =
    totalStudents === 0
      ? 0
      : Math.round(
          classStudents.reduce((sum, s) => sum + (s?.ipaScore ?? 88), 0) / totalStudents
        ); // placeholder default 88

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* Class Overview */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-6 shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-4">Tổng quan lớp học</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Students */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Số học sinh</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalStudents}</p>
            <span className="text-[11px] text-indigo-300 font-semibold">Tổng số học sinh trong lớp</span>
          </div>
          {/* Streak Retention */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Tỷ lệ duy trì streak</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{avgStreak}%</p>
            <span className="text-[11px] text-amber-300 font-semibold">Trung bình ngày streak</span>
          </div>
          {/* Assignment Completion */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Tỷ lệ hoàn thành bài tập</span>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-black text-white">{avgCompletion}%</p>
            <span className="text-[11px] text-green-300 font-semibold">Số từ đã học trung bình</span>
          </div>
          {/* Avg IPA Score */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Điểm IPA trung bình</span>
              <Mic className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white">{avgIpaScore}%</p>
            <span className="text-[11px] text-purple-300 font-semibold">Đánh giá phát âm lớp</span>
          </div>
        </div>
      </div>

      {/* Student Progress Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
        <h3 className="text-xl font-black text-white mb-4">Theo dõi tiến độ học sinh</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-800">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Học sinh</th>
                <th className="px-4 py-2">Streak (ngày)</th>
                <th className="px-4 py-2">Từ đã học hôm nay</th>
                <th className="px-4 py-2">Điểm IPA</th>
                <th className="px-4 py-2">Cấp độ</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((s, idx) => (
                <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 font-medium text-white">{s.levelTitle ?? 'Học sinh'}</td>
                  <td className="px-4 py-2">{s.streak ?? 0}</td>
                  <td className="px-4 py-2">{s.wordsReviewedToday ?? 0}</td>
                  <td className="px-4 py-2">{(s as any).ipaScore ?? 88}%</td>
                  <td className="px-4 py-2">{s.level ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

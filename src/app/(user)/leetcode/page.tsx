'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flame, CalendarDays, Target, Trophy } from 'lucide-react';

export default function UserProfilePage() {
  const user = {
    name: 'John Doe',
    leetcodeUsername: 'johndoe_lcd',
    streak: 45,
    currentStreak: 45,
    maxStreak: 62,
    totalSolved: 312,
    easySolved: 120,
    mediumSolved: 150,
    hardSolved: 42,
    joinDate: '2025-01-01',
    avatarUrl: '', // Add real avatar if available
  };

  // Mock activity calendar data (date -> solved count)
  const activityData: Record<string, number> = {
    '2025-12-01': 2,
    '2025-12-02': 1,
    '2025-12-03': 0,
    // ... more dates
  };

  // Generate dates for calendar (last 6 months)
  const [date, setDate] = useState<Date | undefined>(new Date());

  const getTileClassName = ({ date }: { date: Date }) => {
    const key = date.toISOString().split('T')[0];
    const count = activityData[key] || 0;
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-green-300';
    if (count >= 2) return 'bg-green-600';
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="relative px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
              <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">LeetCode: {user.leetcodeUsername}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.currentStreak} days</div>
              <p className="text-xs text-muted-foreground">Keep the fire burning! 🔥</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Max Streak</CardTitle>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.maxStreak} days</div>
              <p className="text-xs text-muted-foreground">Personal best</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
              <Target className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.totalSolved}</div>
              <p className="text-xs text-muted-foreground">Problems crushed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <CalendarDays className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
              <p className="text-xs text-muted-foreground">Consistent warrior</p>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Problems Solved by Difficulty</CardTitle>
            <CardDescription>Your progress across Easy, Medium, and Hard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Easy</Badge>
                <span className="font-semibold">{user.easySolved}</span>
              </div>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${(user.easySolved / user.totalSolved) * 100}%` }}></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>
                <span className="font-semibold">{user.mediumSolved}</span>
              </div>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-4">
                <div className="bg-yellow-500 h-4 rounded-full" style={{ width: `${(user.mediumSolved / user.totalSolved) * 100}%` }}></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Hard</Badge>
                <span className="font-semibold">{user.hardSolved}</span>
              </div>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-4">
                <div className="bg-red-500 h-4 rounded-full" style={{ width: `${(user.hardSolved / user.totalSolved) * 100}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Calendar</CardTitle>
            <CardDescription>Visual streak and consistency tracker</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                solved1: Object.keys(activityData).filter(k => activityData[k] === 1).map(d => new Date(d)),
                solved2: Object.keys(activityData).filter(k => activityData[k] >= 2).map(d => new Date(d)),
                missed: Object.keys(activityData).filter(k => activityData[k] === 0).map(d => new Date(d)),
              }}
              modifiersClassNames={{
                solved1: 'bg-green-300 text-white',
                solved2: 'bg-green-600 text-white',
                missed: 'bg-gray-200 text-gray-500',
              }}
            />
          </CardContent>
          <CardContent className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <span>1 solved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>2 solved</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
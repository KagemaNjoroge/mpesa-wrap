"use client";

import { ParsedStatement } from "@/lib/api";
import { TrendingUp, TrendingDown, Users, Clock, Calendar, Heart, Gift, Sunrise, Sun, Sunset, Moon, Check, Share2 } from "lucide-react";

interface SlideProps {
  data: ParsedStatement;
}

export function IntroSlide({ data }: SlideProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8">
      <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mb-4 animate-[ping_1s_ease-in-out_3]">
        <span className="text-4xl font-bold text-white">M</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Your M-PESA
      </h1>
      <h2 className="text-5xl md:text-6xl font-bold text-green-600 animate-fade-in animation-delay-200">
        Wrapped
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md animate-fade-in animation-delay-400">
        {data.statement_begin_date} - {data.statement_end_date}
      </p>
      <p className="text-lg text-gray-500 dark:text-gray-500 animate-fade-in animation-delay-600">
        {data.customer_name}
      </p>
    </div>
  );
}

export function SummarySlide({ data }: SlideProps) {
  const total = data.summary["TOTAL:"];
  const paidIn = parseFloat(total.paid_in.replace(/,/g, ""));
  const paidOut = parseFloat(total.paid_out.replace(/,/g, ""));
  const netBalance = paidIn - paidOut;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Your Money Movement
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-8 space-y-2 animate-slide-up">
          <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Money In</p>
          <p className="text-4xl font-bold text-green-600">
            KES {paidIn.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-8 space-y-2 animate-slide-up animation-delay-200">
          <TrendingDown className="w-8 h-8 text-red-600 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Money Out</p>
          <p className="text-4xl font-bold text-red-600">
            KES {paidOut.toLocaleString()}
          </p>
        </div>
      </div>

      <div className={`text-2xl font-semibold animate-fade-in animation-delay-400 ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        Net: KES {netBalance.toLocaleString()}
      </div>
    </div>
  );
}

export function TopCategoriesSlide({ data }: SlideProps) {
  const categories = [
    { name: "Sent Money", data: data.summary["SEND MONEY:"] },
    { name: "Received Money", data: data.summary["RECEIVED MONEY:"] },
    { name: "PayBill", data: data.summary["LIPA NA M-PESA (PAYBILL):"] },
    { name: "Buy Goods", data: data.summary["LIPA NA M-PESA (BUY GOODS):"] },
  ]
    .filter(cat => cat.data) // remove undefined categories
    .map(cat => ({
      name: cat.name,
      amount: parseFloat(cat.data?.paid_out?.replace(/,/g, "") || "0")
    }))
    .filter(cat => cat.amount > 0)
    .sort((a, b) => b.amount - a.amount);

 
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
          Top Spending Categories
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md animate-fade-in animation-delay-200">
          No spending data found in this statement period
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Top Spending Categories
      </h2>
      
      <div className="w-full max-w-lg space-y-4">
        {categories.slice(0, 4).map((cat, idx) => (
          <div 
            key={cat.name}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 flex items-center justify-between border border-gray-200 dark:border-gray-800 animate-slide-right"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {cat.name}
              </span>
            </div>
            <span className="text-xl font-bold text-green-600">
              KES {cat.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SoulmatesSlide({ data }: SlideProps) {
  const topSender = Object.entries(data.soul_mates?.top_senders || {})[0];
  const topReceiver = Object.entries(data.soul_mates?.top_receivers || {})[0];

  // if no soulmates data show a friendly message
  if (!topSender && !topReceiver) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
        <Users className="w-16 h-16 text-green-600 animate-bounce" />
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
          Your M-PESA Soulmates
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md animate-fade-in animation-delay-200">
          No frequent contacts found in this statement period
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
      <Users className="w-16 h-16 text-green-600 animate-bounce" />
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Your M-PESA Soulmates
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {topSender && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-2xl p-8 space-y-4 animate-slide-up">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
              Top Sender
            </p>
            <div className="w-16 h-16 rounded-full bg-green-600 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {topSender[1].name}
            </p>
            <p className="text-3xl font-bold text-green-600">
              KES {topSender[1].total_amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {topSender[1].count} transaction{topSender[1].count > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {topReceiver && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl p-8 space-y-4 animate-slide-up animation-delay-200">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
              Top Receiver
            </p>
            <div className="w-16 h-16 rounded-full bg-blue-600 mx-auto flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {topReceiver[1].name}
            </p>
            <p className="text-3xl font-bold text-blue-600">
              KES {topReceiver[1].total_amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {topReceiver[1].count} transaction{topReceiver[1].count > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function TimeOfDaySlide({ data }: SlideProps) {
  const times = [
    { name: "Morning", period: "5AM - 12PM", data: data.time_of_day_spending.morning, icon: Sunrise },
    { name: "Afternoon", period: "12PM - 5PM", data: data.time_of_day_spending.afternoon, icon: Sun },
    { name: "Evening", period: "5PM - 9PM", data: data.time_of_day_spending.evening, icon: Sunset },
    { name: "Night", period: "9PM - 5AM", data: data.time_of_day_spending.night, icon: Moon },
  ].sort((a, b) => b.data.amount - a.data.amount);

  const topTime = times[0];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
      <Clock className="w-16 h-16 text-green-600 animate-spin-slow" />
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        When You Spend
      </h2>
      
      <div className="space-y-6">
        <div className="animate-bounce">
          <topTime.icon className="w-16 h-16 text-green-600 mx-auto" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl text-gray-600 dark:text-gray-400">
            You're a <span className="font-bold text-green-600">{topTime.name}</span> spender
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500">
            {topTime.period}
          </p>
        </div>
        <p className="text-4xl font-bold text-green-600 animate-fade-in animation-delay-200">
          KES {topTime.data.amount.toLocaleString()}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          across {topTime.data.count} transactions
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 w-full max-w-2xl mt-8">
        {times.map((time, idx) => {
          const TimeIcon = time.icon;
          return (
          <div 
            key={time.name}
            className="text-center space-y-2 animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <TimeIcon className="w-8 h-8 text-green-600 mx-auto" />
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {time.name}
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {time.data.count}
            </p>
          </div>
        );
        })}
      </div>
    </div>
  );
}

export function WeekdaySlide({ data }: SlideProps) {
  const days = Object.entries(data.weekday_spending)
    .map(([day, stats]) => ({ day, ...stats }))
    .sort((a, b) => b.amount - a.amount);

  const topDay = days[0];
  const maxAmount = Math.max(...days.map(d => d.amount));

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
      <Calendar className="w-16 h-16 text-green-600 animate-pulse" />
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Your Spending Week
      </h2>
      
      <div className="space-y-4">
        <p className="text-2xl text-gray-600 dark:text-gray-400">
          <span className="font-bold text-green-600">{topDay.day}</span> is your biggest spending day
        </p>
        <p className="text-4xl font-bold text-green-600">
          KES {topDay.amount.toLocaleString()}
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-3">
        {days.map((day, idx) => {
          const percentage = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
          return (
            <div 
              key={day.day}
              className="animate-slide-right"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {day.day}
                </span>
                <span className="text-sm font-bold text-green-600">
                  KES {day.amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WeekendVsWeekdaySlide({ data }: SlideProps) {
  const weekday = data.day_vs_weekend_spending.weekday;
  const weekend = data.day_vs_weekend_spending.weekend;
  const total = weekday.amount + weekend.amount;
  const weekdayPercent = total > 0 ? (weekday.amount / total) * 100 : 50;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Weekday vs Weekend
      </h2>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-8 space-y-3 animate-slide-up">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase">
            Weekdays
          </p>
          <p className="text-5xl font-bold text-blue-600">
            {weekdayPercent.toFixed(0)}%
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            KES {weekday.amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {weekday.count} transactions
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-2xl p-8 space-y-3 animate-slide-up animation-delay-200">
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase">
            Weekends
          </p>
          <p className="text-5xl font-bold text-purple-600">
            {(100 - weekdayPercent).toFixed(0)}%
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            KES {weekend.amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {weekend.count} transactions
          </p>
        </div>
      </div>

      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md animate-fade-in animation-delay-400">
        You spend more on {weekdayPercent > 50 ? 'weekdays' : 'weekends'}
      </p>
    </div>
  );
}

export function FinalSlide({ data }: SlideProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
      <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center animate-bounce">
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
      
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white animate-fade-in">
        That's Your
      </h2>
      <h2 className="text-4xl md:text-5xl font-bold text-green-600 animate-fade-in animation-delay-200">
        M-PESA Wrapped!
      </h2>
      
      <div className="space-y-2 animate-fade-in animation-delay-400">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {data.transactions.length} total transactions
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-500">
          {data.statement_begin_date} - {data.statement_end_date}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in animation-delay-600">
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors"
        >
          Upload Another Statement
        </button>
        <button 
          onClick={() => {
            const shareData = {
              title: 'M-PESA Wrapped',
              text: 'Discover your M-PESA spending story! Check out M-PESA Wrapped 💚',
              url: window.location.origin,
            };
            if (navigator.share) {
              navigator.share(shareData);
            } else {
              navigator.clipboard.writeText(window.location.origin);
              alert('Link copied to clipboard!');
            }
          }}
          className="px-8 py-4 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-green-600 font-semibold rounded-full transition-colors border-2 border-green-600 flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share with Friends
        </button>
      </div>
    </div>
  );
}

"use client";

import { ParsedStatement } from "@/lib/api";
import { TrendingUp, TrendingDown, Users, Clock, Calendar, Heart, Gift, Sunrise, Sun, Sunset, Moon, Check, Share2, Banknote } from "lucide-react";
import Image from "next/image";

interface SlideProps {
  data: ParsedStatement;
}

export function IntroSlide({ data }: SlideProps) {
  // personalized greeting
  const firstName = data.customer_name?.split(' ')[0] || 'there';
  
  // greeting based on time of day
  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 sm:space-y-5 p-6 sm:p-8 pt-12 sm:pt-16">
      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2 sm:mb-4 animate-[bounce_1s_ease-in-out_3]">
        <Image
          src="/mpesa.png"
          alt="M-PESA Logo"
          width={96}
          height={96}
          className="w-15 h-15 sm:w-20 sm:h-14"
        />
      </div>
      
      <div className="space-y-1 animate-fade-in">
        <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400">
          {greeting}, <span className="font-semibold text-green-600">{firstName}</span>! 👋
        </p>
      </div>
      
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white animate-fade-in animation-delay-200">
        Your M-PESA
      </h1>
      <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-green-600 animate-fade-in animation-delay-400">
        Wrapped
      </h2>
      
      <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-400 max-w-md animate-fade-in animation-delay-600">
        Let's take a look at how your money moved
      </p>
      
      <div className="pt-2 sm:pt-4 space-y-1 animate-fade-in animation-delay-800">
        <p className="text-xs sm:text-base text-gray-400 dark:text-gray-500">
          {data.statement_begin_date} — {data.statement_end_date}
        </p>
      </div>
    </div>
  );
}

export function SummarySlide({ data }: SlideProps) {
  const total = data.summary["TOTAL:"];
  const paidIn = parseFloat(total.paid_in.replace(/,/g, ""));
  const paidOut = parseFloat(total.paid_out.replace(/,/g, ""));
  const netBalance = paidIn - paidOut;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-8 p-4 sm:p-8 pt-12 sm:pt-16">
      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Your Money Movement
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 w-full max-w-2xl">
        <div className="bg-green-50 dark:bg-green-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 space-y-1 sm:space-y-2 animate-slide-up">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-1 sm:mb-2" />
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">Money In</p>
          <p className="text-xl sm:text-4xl font-bold text-green-600">
            KES {paidIn.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 space-y-1 sm:space-y-2 animate-slide-up animation-delay-200">
          <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 mb-1 sm:mb-2" />
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">Money Out</p>
          <p className="text-xl sm:text-4xl font-bold text-red-600">
            KES {paidOut.toLocaleString()}
          </p>
        </div>
      </div>

      <div className={`text-lg sm:text-2xl font-semibold animate-fade-in animation-delay-400 ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-8 p-4 sm:p-8 pt-12 sm:pt-16">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
          Top Spending Categories
        </h2>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-md animate-fade-in animation-delay-200">
          No spending data found in this statement period
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-8 p-4 sm:p-8 pt-12 sm:pt-16">
      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Top Spending Categories
      </h2>
      
      <div className="w-full max-w-lg space-y-2 sm:space-y-4">
        {categories.slice(0, 4).map((cat, idx) => (
          <div 
            key={cat.name}
            className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-3 sm:p-6 flex items-center justify-between border border-gray-200 dark:border-gray-800 animate-slide-right"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                {idx + 1}
              </div>
              <span className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
                {cat.name}
              </span>
            </div>
            <span className="text-base sm:text-xl font-bold text-green-600">
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
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-8 p-4 sm:p-8 pt-12 sm:pt-16">
        <Users className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 animate-bounce" />
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
          Your M-PESA Soulmates
        </h2>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-md animate-fade-in animation-delay-200">
          No frequent contacts found in this statement period
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-8 p-4 sm:p-8 pt-12 sm:pt-16">
      <Users className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 animate-bounce" />
      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Your M-PESA Soulmates
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full max-w-3xl">
        {topSender && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-8 space-y-2 sm:space-y-4 animate-slide-up">
            <p className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
              Top Sender
            </p>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-600 mx-auto flex items-center justify-center">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {topSender[1].name}
            </p>
            <p className="text-xl sm:text-3xl font-bold text-green-600">
              KES {topSender[1].total_amount.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {topSender[1].count} transaction{topSender[1].count > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {topReceiver && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-8 space-y-2 sm:space-y-4 animate-slide-up animation-delay-200">
            <p className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
              Top Receiver
            </p>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-600 mx-auto flex items-center justify-center">
              <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {topReceiver[1].name}
            </p>
            <p className="text-xl sm:text-3xl font-bold text-blue-600">
              KES {topReceiver[1].total_amount.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {topReceiver[1].count} transaction{topReceiver[1].count > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function TransactionCostsSlide({ data }: SlideProps) {
  const transCost = data.trans_cost || 0;
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-8 p-4 sm:p-8 pt-12 sm:pt-16">
      <div className="relative">
        <Banknote className="w-12 h-12 sm:w-20 sm:h-20 text-green-600 animate-pulse" />
        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      </div>
      
      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        The Cost of Convenience
      </h2>
      
      <div className="space-y-3 sm:space-y-6 max-w-lg">
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 animate-fade-in animation-delay-200">
          You paid Safaricom
        </p>
        
        <div className="animate-slide-up animation-delay-400">
          <p className="text-4xl sm:text-6xl font-bold text-green-600">
            KES {transCost.toLocaleString()}
          </p>
        </div>
        
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 animate-fade-in animation-delay-600">
          just to move your money around 
        </p>
      </div>
      
      <div className="mt-4 sm:mt-8 p-4 sm:p-6 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl sm:rounded-2xl max-w-md animate-fade-in animation-delay-800">
        <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400">
          This includes PayBill charges and money transfer fees from your transactions.
        </p>
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
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-6 p-4 sm:p-8 pt-12 sm:pt-16">
      <Clock className="w-10 h-10 sm:w-16 sm:h-16 text-green-600 animate-spin-slow" />
      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        When You Spend
      </h2>
      
      <div className="space-y-3 sm:space-y-6">
        <div className="animate-bounce">
          <topTime.icon className="w-10 h-10 sm:w-16 sm:h-16 text-green-600 mx-auto" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400">
            You're a <span className="font-bold text-green-600">{topTime.name}</span> spender
          </p>
          <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-500">
            {topTime.period}
          </p>
        </div>
        <p className="text-2xl sm:text-4xl font-bold text-green-600 animate-fade-in animation-delay-200">
          KES {topTime.data.amount.toLocaleString()}
        </p>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
          across {topTime.data.count} transactions
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-2xl mt-4 sm:mt-8">
        {times.map((time, idx) => {
          const TimeIcon = time.icon;
          return (
          <div 
            key={time.name}
            className="text-center space-y-1 sm:space-y-2 animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <TimeIcon className="w-5 h-5 sm:w-8 sm:h-8 text-green-600 mx-auto" />
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">
              {time.name}
            </p>
            <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
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
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-8 p-4 sm:p-8 pt-12 sm:pt-16">
      <Calendar className="w-10 h-10 sm:w-16 sm:h-16 text-green-600 animate-pulse" />
      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Your Spending Week
      </h2>
      
      <div className="space-y-2 sm:space-y-4">
        <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400">
          <span className="font-bold text-green-600">{topDay.day}</span> is your biggest spending day
        </p>
        <p className="text-2xl sm:text-4xl font-bold text-green-600">
          KES {topDay.amount.toLocaleString()}
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-2 sm:space-y-3">
        {days.map((day, idx) => {
          const percentage = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
          return (
            <div 
              key={day.day}
              className="animate-slide-right"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {day.day}
                </span>
                <span className="text-xs sm:text-sm font-bold text-green-600">
                  KES {day.amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 sm:h-3 overflow-hidden">
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
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-8 p-4 sm:p-8 pt-12 sm:pt-16">
      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Weekday vs Weekend
      </h2>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-2xl">
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 space-y-1 sm:space-y-3 animate-slide-up">
          <p className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase">
            Weekdays
          </p>
          <p className="text-3xl sm:text-5xl font-bold text-blue-600">
            {weekdayPercent.toFixed(0)}%
          </p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
            KES {weekday.amount.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {weekday.count} transactions
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 space-y-1 sm:space-y-3 animate-slide-up animation-delay-200">
          <p className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase">
            Weekends
          </p>
          <p className="text-3xl sm:text-5xl font-bold text-purple-600">
            {(100 - weekdayPercent).toFixed(0)}%
          </p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
            KES {weekend.amount.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {weekend.count} transactions
          </p>
        </div>
      </div>

      <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-md animate-fade-in animation-delay-400">
        You spend more on {weekdayPercent > 50 ? 'weekdays' : 'weekends'}
      </p>
    </div>
  );
}

export function FinalSlide({ data }: SlideProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-8 p-4 sm:p-8 pt-12 sm:pt-16">
      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-green-600 flex items-center justify-center animate-bounce">
        <Check className="w-7 h-7 sm:w-10 sm:h-10 text-white" strokeWidth={3} />
      </div>
      
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white animate-fade-in">
        That's Your
      </h2>
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-green-600 animate-fade-in animation-delay-200">
        M-PESA Wrapped!
      </h2>
      
      <div className="space-y-1 sm:space-y-2 animate-fade-in animation-delay-400">
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400">
          {data.transactions.length} total transactions
        </p>
        <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-500">
          {data.statement_begin_date} - {data.statement_end_date}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-8 animate-fade-in animation-delay-600 w-full max-w-md sm:max-w-none sm:w-auto">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 sm:px-8 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors text-sm sm:text-base"
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
          className="px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-green-600 font-semibold rounded-full transition-colors border-2 border-green-600 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          Share with Friends
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Upload, Lock, Shield, Eye, EyeOff, Trash2, TrendingUp, Users, Clock, ChevronDown, ChevronUp, HelpCircle, ExternalLink } from "lucide-react";
import Image from "next/image";

interface UploadPageProps {
  onUploadComplete: (data: any) => void;
}

export function UploadPage({ onUploadComplete }: UploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const { fetchStatement } = await import("@/lib/api");
      const data = await fetchStatement(file, password || null);
      onUploadComplete(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to process statement. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-green-950/20 dark:via-black dark:to-green-950/20">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        
        {/* hero */}
        <div className="text-center space-y-4 mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Image
                src="/mpesa.png"
                alt="M-PESA Logo"
                width={48}
                height={48}
              />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            M-PESA <span className="text-green-600">Wrapped</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See your M-PESA spending story — who you send money to most, when you spend, and how your money moves.
          </p>
        </div>

        {/* data points to discover */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Money In & Out</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Top Contacts</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Spending Times</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
            <div className="w-8 h-8 text-green-600 mx-auto mb-2 flex items-center justify-center font-bold text-lg">KES</div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Fees</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* upload pdf */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Upload Your Statement
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
            
              <div>
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all"
                >
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-green-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      M-PESA Statement (PDF file)
                    </p>
                    {file && (
                      <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <span className="text-sm text-green-700 dark:text-green-400 font-medium truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); setFile(null); }}
                          className="text-green-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* passwd */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  PDF Password <span className="text-gray-400 font-normal">(if your statement is protected)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter password sent via SMS"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Safaricom sends this password via SMS when you request your statement.
                </p>
              </div>

              {/* err*/}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

             
              <button
                type="submit"
                disabled={!file || isUploading}
                className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-green-600/20"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing your statement...</span>
                  </>
                ) : (
                  <span>Get Your Wrapped ✨</span>
                )}
              </button>
            </form>
          </div>

          {/* privacyy */}
          <div className="space-y-4">
         
            <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Your Privacy is Protected
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span><strong>We don't store your data</strong> — your statement is analyzed and immediately discarded</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span><strong>No account needed</strong> — we don't collect your email, phone, or any personal info</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span><strong>100% Open Source</strong> — anyone can verify exactly how we handle your data</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* getting statement */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <button
                onClick={() => setShowHowTo(!showHowTo)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">How do I get my M-PESA statement?</span>
                </div>
                {showHowTo ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {showHowTo && (
                <div className="px-6 pb-5 border-t border-gray-100 dark:border-gray-800">
                  <div className="pt-4 space-y-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">Option 1: Via M-PESA App</p>
                      <ol className="list-decimal list-inside space-y-1 ml-1">
                        <li>Open the M-PESA app</li>
                        <li>Go to <strong>Profile</strong></li>
                        <li>Tap <strong>M-PESA Statements</strong></li>
                        <li>Select export, select duration(cannot be more that 6 months)</li>
                        <li>Download the PDF (statements generated via M-PESA App have no password)</li>
                      </ol>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">Option 2: Via USSD</p>
                      <ol className="list-decimal list-inside space-y-1 ml-1">
                        <li>Dial <strong>*334#</strong> on Safaricom</li>
                        <li>Select <strong>My Account</strong></li>
                        <li>Select <strong>M-PESA Statement</strong></li>
                        <li>Select <strong>Request Statement</strong></li>
                        <li>Select <strong>Full Satement</strong></li>
                        <li>Select <strong>Time range</strong></li>
                        <li>Enter your email to receive the PDF. The statement password is delivered via SMS</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FAQs */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <button
                onClick={() => setShowFAQ(!showFAQ)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Frequently Asked Questions</span>
                </div>
                {showFAQ ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {showFAQ && (
                <div className="px-6 pb-5 border-t border-gray-100 dark:border-gray-800">
                  <div className="pt-4 space-y-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Is this an official Safaricom service?</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">No, this is an independent project. We are not affiliated with Safaricom or M-PESA. We simply read your statement to show you interesting insights.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Can you access my M-PESA account?</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Absolutely not. We only read the PDF file you upload. We cannot access your M-PESA account, make transactions, or see your PIN.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Why do you need my statement password?</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Some M-PESA statements are password-protected by Safaricom for your security. We need the password only to open and read the PDF — it's never saved.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* oss */}
            <a
              href="https://github.com/kagemanjoroge/mpesa-wrap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View source code on GitHub</span>
            </a>
          </div>
        </div>

     
        <div className="mt-12 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>Made with 💚 in Kenya</p>
        </div>
      </div>
    </div>
  );
}

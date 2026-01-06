"use client";

import { useState, useEffect } from "react";
import { ParsedStatement } from "@/lib/api";
import { UploadPage } from "@/components/upload-page";
import { WrapViewer } from "@/components/wrap-viewer";

export default function Home() {
  const [statementData, setStatementData] = useState<ParsedStatement | null>(null);

  // keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && statementData) {
        setStatementData(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [statementData]);

  if (statementData) {
    return <WrapViewer data={statementData} />;
  }

  return <UploadPage onUploadComplete={setStatementData} />;
}

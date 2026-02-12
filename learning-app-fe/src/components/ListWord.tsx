import React, { useState, useEffect } from "react";
import {
  Volume2,
  BookmarkPlus,
  Filter,
  Search,
} from "lucide-react";
import { vocabService, VocabResponse } from "@/services/vocabService";

interface VocabListProps {
  isDark: boolean;
}

const VocabList: React.FC<VocabListProps> = ({ isDark }) => {
  const [vocabs, setVocabs] = useState<VocabResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "saved">("all");

  useEffect(() => {
    loadVocabs();
  }, []);

  const loadVocabs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vocabService.getMyVocabs();
      setVocabs(data);
    } catch (err) {
      console.error("Error loading vocabs:", err);
      setError("Không thể tải từ vựng. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const playSound = (text: string, audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error("Error playing audio:", err));
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-200 to-blue-200 flex items-center justify-center p-4">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-200 to-blue-200 flex items-center justify-center p-4">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-200 to-blue-200 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-4 mb-6 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">✏️</span>
            </div>
            <h1 className="text-white text-xl md:text-2xl font-bold">
              Từ vựng trong bài
            </h1>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📝</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-1 w-fit ml-auto shadow-md">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              activeFilter === "all"
                ? "bg-white text-amber-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveFilter("saved")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              activeFilter === "saved"
                ? "bg-white text-amber-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Đã lưu
          </button>
        </div>

        {/* Vocab Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vocabs.map((vocab, index) => (
            <div
              key={vocab.id}
              className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-lg hover:shadow-xl transition relative"
            >
              {/* Bookmark Icon */}
              <button className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-600 transition">
                <BookmarkPlus className="w-5 h-5" />
              </button>

              {/* Japanese Word */}
              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {vocab.surface}
                </div>
              </div>

              {/* Category/Type */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {getCategoryName(index)}
                </div>
                <div className="text-sm text-gray-600">
                  {vocab.reading}
                </div>
              </div>

              {/* Meanings */}
              <div className="space-y-1 mb-4">
                {vocab.translated.split(",").map((meaning, idx) => (
                  <div key={idx} className="text-gray-700">
                    <span className="text-gray-500">{idx + 1}.</span> {meaning.trim()}
                  </div>
                ))}
              </div>

              {/* Reading */}
              <div className="text-sm text-gray-500 mb-4">
                {vocab.reading}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => playSound(vocab.surface, vocab.audioUrl)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg transition text-amber-700 text-sm font-medium"
                >
                  <span>Thêm Mẫu</span>
                  <span className="text-lg">👑</span>
                </button>

                <button
                  onClick={() => playSound(vocab.surface, vocab.audioUrl)}
                  className="w-10 h-10 bg-amber-400 hover:bg-amber-500 rounded-full flex items-center justify-center shadow-md transition"
                >
                  <Volume2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get category names (rotating through the categories shown in the image)
const getCategoryName = (index: number): string => {
  const categories = [
    "QUYỀN LỰC",
    "ĐỐI KHÁNG",
    "NGUYÊN TẮC",
    "KINH QUÁ",
    "QUÁ",
    "TRẦM MẶC",
    "TINH TOÁN",
    "PHÁ HOẠI",
    "ĐỐI XỬ",
    "ĐỘC CHIẾM",
    "XÁC LẬP",
    "PHẢN PHÁT",
    "ĐẶC HỮU",
    "NHÂN MỤC",
    "THÀNH VIÊN",
    "GIỚI NHẬP",
  ];
  return categories[index % categories.length];
};

export default VocabList;
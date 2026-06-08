import { useState, useEffect } from 'react'
import { Search, BookOpen, Volume2, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchPhonetics, speakWord, playAudio } from '../utils/dictionary'

function WordList({ vocabulary, progress }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWord, setSelectedWord] = useState(null)
  const [phoneticsCache, setPhoneticsCache] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const wordsPerPage = 50

  const filteredWords = vocabulary.filter(word =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage)
  const startIndex = (currentPage - 1) * wordsPerPage
  const endIndex = startIndex + wordsPerPage
  const currentWords = filteredWords.slice(startIndex, endIndex)

  const getStatusColor = (wordId) => {
    if (progress.mastered?.includes(wordId)) return 'bg-green-100 text-green-800'
    if (progress.learned?.includes(wordId)) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (wordId) => {
    if (progress.mastered?.includes(wordId)) return '已掌握'
    if (progress.learned?.includes(wordId)) return '学习中'
    return '未学习'
  }

  const handleWordClick = async (word) => {
    setSelectedWord(word)
    // Fetch phonetics if not already cached
    if (!phoneticsCache[word.id]) {
      const phonetics = await fetchPhonetics(word.word)
      setPhoneticsCache(prev => ({
        ...prev,
        [word.id]: phonetics
      }))
    }
  }

  const handleSpeak = (word) => {
    const phonetics = phoneticsCache[word.id]
    if (phonetics && phonetics.audio) {
      // Try to play real audio first
      const played = playAudio(phonetics.audio)
      if (!played) {
        // Fallback to TTS
        speakWord(word.word)
      }
    } else {
      // Fallback to TTS
      speakWord(word.word)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-fade-in">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="text-indigo-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">搜索单词</h2>
        </div>
        <input
          type="text"
          placeholder="输入单词或释义进行搜索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 hover:border-indigo-300"
        />
        <p className="text-sm text-gray-500 mt-2">
          共找到 <span className="font-bold text-indigo-600">{filteredWords.length}</span> 个单词
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentWords.map((word, index) => (
          <div
            key={word.id}
            onClick={() => handleWordClick(word)}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 cursor-pointer card-hover animate-slide-in"
            style={{ animationDelay: `${index * 0.02}s` }}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold gradient-text">{word.word}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(word.id)}`}>
                {getStatusText(word.id)}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">{word.definition}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              <span>上一页</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600">
                第 <span className="font-bold text-indigo-600">{currentPage}</span> / {totalPages} 页
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">
                显示 {startIndex + 1}-{Math.min(endIndex, filteredWords.length)} / {filteredWords.length} 个单词
              </span>
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>下一页</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {selectedWord && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedWord(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold gradient-text">{selectedWord.word}</h3>
                {phoneticsCache[selectedWord.id]?.phonetic && (
                  <p className="text-gray-500 text-lg mt-2 font-mono">{phoneticsCache[selectedWord.id].phonetic}</p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSpeak(selectedWord)}
                  className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate"
                >
                  <Volume2 size={24} />
                </button>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-gray-700 text-xl leading-relaxed">{selectedWord.definition}</p>
            <div className="mt-6 flex items-center space-x-2 text-sm text-gray-500">
              <BookOpen size={16} />
              <span>ID: {selectedWord.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WordList

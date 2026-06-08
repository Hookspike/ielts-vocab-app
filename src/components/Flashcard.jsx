import { useState, useEffect } from 'react'
import { RotateCcw, Check, X, ArrowRight, ArrowLeft, Volume2 } from 'lucide-react'
import { fetchPhonetics, speakWord, playAudio } from '../utils/dictionary'

function Flashcard({ vocabulary, progress, updateProgress }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showResult, setShowResult] = useState(null)
  const [phonetics, setPhonetics] = useState(null)

  const currentWord = vocabulary[currentIndex]

  useEffect(() => {
    setIsFlipped(false)
    setShowResult(null)
    setPhonetics(null)
    // Fetch phonetics for current word
    if (currentWord) {
      fetchPhonetics(currentWord.word).then(setPhonetics)
    }
  }, [currentIndex, currentWord])

  const handleKnow = () => {
    const newProgress = { ...progress }
    if (!newProgress.learned?.includes(currentWord.id)) {
      newProgress.learned = [...(newProgress.learned || []), currentWord.id]
    }
    updateProgress(newProgress)
    setShowResult(true)
    setTimeout(() => nextCard(), 500)
  }

  const handleMaster = () => {
    const newProgress = { ...progress }
    if (!newProgress.mastered?.includes(currentWord.id)) {
      newProgress.mastered = [...(newProgress.mastered || []), currentWord.id]
    }
    updateProgress(newProgress)
    setShowResult(true)
    setTimeout(() => nextCard(), 500)
  }

  const handleForgot = () => {
    setShowResult(true)
    setTimeout(() => nextCard(), 500)
  }

  const nextCard = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(vocabulary.length - 1)
    }
  }

  if (!currentWord) {
    return <div className="text-center text-gray-500">加载中...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">闪卡学习</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            {currentIndex + 1} / {vocabulary.length}
          </span>
        </div>

        <div
          className="relative h-80 cursor-pointer perspective-1000"
          onClick={() => !showResult && setIsFlipped(!isFlipped)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-2xl">
              <h3 className="text-4xl font-bold mb-3">{currentWord.word}</h3>
              {phonetics?.phonetic && (
                <p className="text-lg opacity-90 mb-4 font-mono">{phonetics.phonetic}</p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (phonetics && phonetics.audio) {
                    const played = playAudio(phonetics.audio)
                    if (!played) {
                      speakWord(currentWord.word)
                    }
                  } else {
                    speakWord(currentWord.word)
                  }
                }}
                className="mb-4 p-4 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
              >
                <Volume2 size={32} />
              </button>
              <p className="text-sm opacity-75">点击查看释义</p>
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-indigo-200 shadow-2xl">
              <p className="text-2xl text-gray-800 text-center leading-relaxed">{currentWord.definition}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={prevCard}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 btn-animate"
          >
            <ArrowLeft size={20} />
            <span>上一个</span>
          </button>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate"
          >
            <RotateCcw size={20} />
            <span>翻转</span>
          </button>
          <button
            onClick={nextCard}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 btn-animate"
          >
            <span>下一个</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {!showResult && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 animate-slide-in">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">掌握程度</h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleForgot}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate"
            >
              <X size={20} />
              <span>不认识</span>
            </button>
            <button
              onClick={handleKnow}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate"
            >
              <Check size={20} />
              <span>认识</span>
            </button>
            <button
              onClick={handleMaster}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate"
            >
              <Check size={20} />
              <span>已掌握</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Flashcard

import { useState, useEffect } from 'react'
import { Check, X, RotateCcw, Volume2 } from 'lucide-react'
import { fetchPhonetics, speakWord, playAudio } from '../utils/dictionary'

function Quiz({ vocabulary, progress, updateProgress }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [phoneticsCache, setPhoneticsCache] = useState({})

  useEffect(() => {
    generateQuestions()
  }, [vocabulary])

  const generateQuestions = () => {
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5)
    const quizQuestions = shuffled.slice(0, 10).map(word => {
      const wrongAnswers = vocabulary
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.definition)
      
      const options = [...wrongAnswers, word.definition].sort(() => Math.random() - 0.5)
      
      // Fetch phonetics for this word
      fetchPhonetics(word.word).then(phonetics => {
        setPhoneticsCache(prev => ({
          ...prev,
          [word.word]: phonetics
        }))
      })
      
      return {
        word: word.word,
        correctAnswer: word.definition,
        options
      }
    })
    setQuestions(quizQuestions)
    setCurrentIndex(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setQuizComplete(false)
    setPhoneticsCache({})
  }

  const handleAnswer = (answer) => {
    if (showResult) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    
    if (answer === questions[currentIndex].correctAnswer) {
      setScore(score + 1)
      // Mark as learned
      const word = vocabulary.find(w => w.word === questions[currentIndex].word)
      if (word) {
        const newProgress = { ...progress }
        if (!newProgress.learned?.includes(word.id)) {
          newProgress.learned = [...(newProgress.learned || []), word.id]
        }
        updateProgress(newProgress)
      }
    }
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
    }
  }

  const resetQuiz = () => {
    generateQuestions()
  }

  if (questions.length === 0) {
    return <div className="text-center text-gray-500">加载中...</div>
  }

  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 text-center animate-fade-in">
          <h2 className="text-3xl font-bold gradient-text mb-6">测验完成!</h2>
          <div className="text-7xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-6 animate-pulse-glow">
            {score} / {questions.length}
          </div>
          <p className="text-gray-600 text-xl mb-8">
            正确率: <span className="font-bold text-indigo-600">{Math.round((score / questions.length) * 100)}%</span>
          </p>
          <button
            onClick={resetQuiz}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate mx-auto"
          >
            <RotateCcw size={24} />
            <span>重新测验</span>
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">测验练习</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-3">
            <h3 className="text-3xl font-bold gradient-text">
              {currentQuestion.word}
            </h3>
            <button
              onClick={() => {
                const phonetics = phoneticsCache[currentQuestion.word]
                if (phonetics && phonetics.audio) {
                  const played = playAudio(phonetics.audio)
                  if (!played) {
                    speakWord(currentQuestion.word)
                  }
                } else {
                  speakWord(currentQuestion.word)
                }
              }}
              className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate"
            >
              <Volume2 size={24} />
            </button>
          </div>
          {phoneticsCache[currentQuestion.word]?.phonetic && (
            <p className="text-center text-gray-500 text-lg mb-6 font-mono">
              {phoneticsCache[currentQuestion.word].phonetic}
            </p>
          )}
          <p className="text-center text-gray-600 text-lg mb-6">选择正确的释义:</p>
        </div>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = 'bg-white border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md'
            let icon = null

            if (showResult) {
              if (option === currentQuestion.correctAnswer) {
                buttonClass = 'bg-green-50 border-2 border-green-500 shadow-md'
                icon = <Check className="text-green-600" size={24} />
              } else if (option === selectedAnswer) {
                buttonClass = 'bg-red-50 border-2 border-red-500 shadow-md'
                icon = <X className="text-red-600" size={24} />
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`w-full p-5 rounded-xl text-left transition-all duration-300 flex items-center justify-between card-hover ${buttonClass}`}
              >
                <span className="text-gray-800 text-lg">{option}</span>
                {icon}
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className="mt-8 text-center">
            <button
              onClick={nextQuestion}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-animate"
            >
              {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz

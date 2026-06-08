import { useState, useEffect } from 'react'
import { BookOpen, Brain, Search, TrendingUp } from 'lucide-react'
import WordList from './components/WordList'
import Flashcard from './components/Flashcard'
import Quiz from './components/Quiz'
import Progress from './components/Progress'
import { initSpeechSynthesis } from './utils/dictionary'

function App() {
  const [vocabulary, setVocabulary] = useState([])
  const [currentTab, setCurrentTab] = useState('list')
  const [progress, setProgress] = useState({ learned: [], mastered: [] })

  useEffect(() => {
    // Initialize speech synthesis
    initSpeechSynthesis()
    
    // Load vocabulary
    fetch('/vocabulary.json')
      .then(res => res.json())
      .then(data => setVocabulary(data))
      .catch(err => console.error('Failed to load vocabulary:', err))

    // Load progress from localStorage
    const savedProgress = localStorage.getItem('ielts-progress')
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  const updateProgress = (newProgress) => {
    setProgress(newProgress)
    localStorage.setItem('ielts-progress', JSON.stringify(newProgress))
  }

  const tabs = [
    { id: 'list', name: '单词列表', icon: BookOpen },
    { id: 'flashcard', name: '闪卡学习', icon: Brain },
    { id: 'quiz', name: '测验练习', icon: Search },
    { id: 'progress', name: '学习进度', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="animate-float">
              <h1 className="text-4xl font-bold gradient-text">雅思词汇学习</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2 text-lg">IELTS Vocabulary Learning</p>
        </div>
      </header>

      <nav className="bg-white/70 backdrop-blur-sm border-b border-gray-200 sticky top-[88px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab, index) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 btn-animate ${
                    currentTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg animate-pulse-glow'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon size={20} />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {currentTab === 'list' && <WordList vocabulary={vocabulary} progress={progress} />}
          {currentTab === 'flashcard' && (
            <Flashcard vocabulary={vocabulary} progress={progress} updateProgress={updateProgress} />
          )}
          {currentTab === 'quiz' && (
            <Quiz vocabulary={vocabulary} progress={progress} updateProgress={updateProgress} />
          )}
          {currentTab === 'progress' && <Progress vocabulary={vocabulary} progress={progress} />}
        </div>
      </main>
    </div>
  )
}

export default App

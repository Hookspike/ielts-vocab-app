import { Award, BookOpen, Target, TrendingUp } from 'lucide-react'

function Progress({ vocabulary, progress }) {
  const totalWords = vocabulary.length
  const learnedCount = progress.learned?.length || 0
  const masteredCount = progress.mastered?.length || 0
  const remainingCount = totalWords - learnedCount

  const learnedPercentage = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0
  const masteredPercentage = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0

  const stats = [
    {
      label: '总词汇量',
      value: totalWords,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: '学习中',
      value: learnedCount,
      icon: Target,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      label: '已掌握',
      value: masteredCount,
      icon: Award,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: '未学习',
      value: remainingCount,
      icon: TrendingUp,
      color: 'bg-gray-100 text-gray-600'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 card-hover animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-3`}>
                <Icon size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">学习进度</h2>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">学习进度</span>
              <span className="text-sm font-bold text-indigo-600">{learnedPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${learnedPercentage}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">掌握程度</span>
              <span className="text-sm font-bold text-green-600">{masteredPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${masteredPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 animate-slide-in">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">已掌握单词</h2>
        {progress.mastered && progress.mastered.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {progress.mastered.map(id => {
              const word = vocabulary.find(w => w.id === id)
              return word ? (
                <span
                  key={id}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {word.word}
                </span>
              ) : null
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 text-lg">还没有掌握的单词</p>
        )}
      </div>
    </div>
  )
}

export default Progress

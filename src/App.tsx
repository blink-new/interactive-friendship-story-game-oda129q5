import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, MessageCircle, Users, Star, Cloud, Sun, Moon, Rain } from 'lucide-react'

type EmotionType = 'happy' | 'sad' | 'neutral' | 'anxious' | 'hopeful'

interface StoryNode {
  id: string
  text: string
  emotion: EmotionType
  choices: {
    text: string
    nextId: string
    emotionImpact: EmotionType
  }[]
  isEnding?: boolean
}

const storyNodes: StoryNode[] = [
  {
    id: 'start',
    text: "You're Alex, a 17-year-old who just moved to a new town. It's your first day at Jefferson High, and you're standing outside the imposing brick building, watching groups of friends laugh together. Your stomach churns with a familiar mix of anxiety and loneliness.",
    emotion: 'anxious',
    choices: [
      { text: "Take a deep breath and walk in with confidence", nextId: 'confident_entry', emotionImpact: 'hopeful' },
      { text: "Hesitate by the entrance, hoping someone will notice you", nextId: 'hesitant_entry', emotionImpact: 'sad' },
      { text: "Put on your headphones and slip in quietly", nextId: 'quiet_entry', emotionImpact: 'neutral' }
    ]
  },
  {
    id: 'confident_entry',
    text: "You stride through the hallways with purpose, making eye contact with other students. At your locker, you notice someone struggling with their combination lock nearby. It's Sam, who looks just as new and overwhelmed as you feel inside.",
    emotion: 'hopeful',
    choices: [
      { text: "Offer to help Sam with their locker", nextId: 'help_sam', emotionImpact: 'happy' },
      { text: "Smile and nod, then focus on your own locker", nextId: 'polite_distance', emotionImpact: 'neutral' },
      { text: "Pretend you didn't notice and hurry to class", nextId: 'avoid_interaction', emotionImpact: 'sad' }
    ]
  },
  {
    id: 'hesitant_entry',
    text: "You linger by the entrance, watching the easy flow of friendship around you. A group of students brushes past, their laughter echoing in the hallway. You feel invisible, like you're watching life through a window you can't quite reach.",
    emotion: 'sad',
    choices: [
      { text: "Force yourself to approach the group", nextId: 'approach_group', emotionImpact: 'anxious' },
      { text: "Find a quiet spot to sit alone", nextId: 'sit_alone', emotionImpact: 'sad' },
      { text: "Look for another person who seems alone", nextId: 'find_lonely', emotionImpact: 'hopeful' }
    ]
  },
  {
    id: 'help_sam',
    text: "Sam looks up gratefully as you approach. 'Thanks, I'm Sam,' they say with a relieved smile. 'I'm terrible with these things.' As you help them figure out the combination, you realize they're in your next class. For the first time today, you don't feel alone.",
    emotion: 'happy',
    choices: [
      { text: "Suggest walking to class together", nextId: 'walk_together', emotionImpact: 'happy' },
      { text: "Share that you're new too", nextId: 'bond_over_newness', emotionImpact: 'hopeful' },
      { text: "Just say 'you're welcome' and leave", nextId: 'missed_opportunity', emotionImpact: 'neutral' }
    ]
  },
  {
    id: 'sit_alone',
    text: "You find an empty bench in the courtyard. The autumn leaves drift past the windows, and you feel their melancholy in your bones. Other students chat and laugh around you, but their voices seem to come from another world. You pull out your phone and scroll through social media, seeing everyone else's 'perfect' lives.",
    emotion: 'sad',
    choices: [
      { text: "Put your phone away and observe the world around you", nextId: 'mindful_observation', emotionImpact: 'neutral' },
      { text: "Text your mom about how you're feeling", nextId: 'reach_out_family', emotionImpact: 'hopeful' },
      { text: "Continue scrolling, sinking deeper into loneliness", nextId: 'spiral_deeper', emotionImpact: 'sad' }
    ]
  },
  {
    id: 'walk_together',
    text: "Sam's face lights up. 'That would be amazing! I was dreading walking into that classroom alone.' As you walk together, you discover you both love the same obscure indie band, and Sam mentions they're starting a creative writing club. Maybe this new town won't be so lonely after all.",
    emotion: 'happy',
    choices: [
      { text: "Ask about joining the writing club", nextId: 'join_club', emotionImpact: 'happy' },
      { text: "Share your own creative interests", nextId: 'share_interests', emotionImpact: 'happy' },
      { text: "Suggest hanging out after school", nextId: 'suggest_hangout', emotionImpact: 'hopeful' }
    ]
  },
  {
    id: 'join_club',
    text: "Sam's eyes practically sparkle. 'Really? We meet every Thursday after school in the library. It's just me and two other people so far, but we're hoping to grow.' You realize this is exactly what you needed - a place to belong, to express yourself, and to connect with others who understand your inner world.",
    emotion: 'happy',
    choices: [
      { text: "Commit to joining and ask what you should bring", nextId: 'committed_member', emotionImpact: 'happy' },
      { text: "Say you'll think about it", nextId: 'maybe_later', emotionImpact: 'neutral' }
    ]
  },
  {
    id: 'committed_member',
    text: "Three months later, you're sitting in a circle with Sam and four other friends from the writing club. You've just finished reading aloud a story about finding connection in unexpected places. Everyone is quiet for a moment, then they start sharing how much your words moved them. You realize you're not the lonely kid who walked into Jefferson High anymore - you're someone who belongs.",
    emotion: 'happy',
    choices: [],
    isEnding: true
  },
  {
    id: 'spiral_deeper',
    text: "The loneliness feels overwhelming. You see posts of friends from your old school having fun without you, and it confirms your worst fears - that you're forgettable, that making friends is impossible. But then you remember something your therapist said: 'Loneliness is not about being alone; it's about feeling disconnected.' Maybe tomorrow you can try a different approach.",
    emotion: 'sad',
    choices: [
      { text: "Decide to try reaching out tomorrow", nextId: 'hope_tomorrow', emotionImpact: 'hopeful' },
      { text: "Accept that this is just how things are", nextId: 'acceptance_ending', emotionImpact: 'sad' }
    ]
  },
  {
    id: 'hope_tomorrow',
    text: "You take a deep breath and remind yourself that every friendship started with someone taking the first step. Tomorrow, you'll try again. You'll smile at someone, offer help, or maybe just say hello. The loneliness feels heavy today, but it doesn't have to be permanent. Growth happens one small brave moment at a time.",
    emotion: 'hopeful',
    choices: [],
    isEnding: true
  }
]

const emotionThemes = {
  happy: {
    background: 'from-amber-100 via-yellow-100 to-orange-100',
    darkBackground: 'from-amber-900 via-yellow-900 to-orange-900',
    textColor: 'text-amber-900',
    darkTextColor: 'text-amber-100',
    icon: Sun,
    particles: '☀️',
    description: 'Warm sunlight fills the space'
  },
  sad: {
    background: 'from-slate-200 via-gray-300 to-blue-200',
    darkBackground: 'from-slate-800 via-gray-700 to-blue-800',
    textColor: 'text-slate-700',
    darkTextColor: 'text-slate-300',
    icon: Rain,
    particles: '💧',
    description: 'Heavy clouds gather overhead'
  },
  neutral: {
    background: 'from-gray-100 via-gray-100 to-gray-200',
    darkBackground: 'from-gray-800 via-gray-800 to-gray-700',
    textColor: 'text-gray-700',
    darkTextColor: 'text-gray-300',
    icon: Cloud,
    particles: '☁️',
    description: 'A quiet, contemplative atmosphere'
  },
  anxious: {
    background: 'from-purple-200 via-indigo-200 to-pink-200',
    darkBackground: 'from-purple-800 via-indigo-800 to-pink-800',
    textColor: 'text-purple-800',
    darkTextColor: 'text-purple-200',
    icon: Heart,
    particles: '💫',
    description: 'Energy crackles with nervous anticipation'
  },
  hopeful: {
    background: 'from-emerald-100 via-teal-100 to-cyan-100',
    darkBackground: 'from-emerald-900 via-teal-900 to-cyan-900',
    textColor: 'text-emerald-800',
    darkTextColor: 'text-emerald-200',
    icon: Star,
    particles: '✨',
    description: 'Gentle light begins to emerge'
  }
}

function App() {
  const [currentNodeId, setCurrentNodeId] = useState('start')
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral')
  const [gameStarted, setGameStarted] = useState(false)
  const [emotionHistory, setEmotionHistory] = useState<EmotionType[]>([])
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev]
        if (newParticles.length < 6) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100
          })
        }
        return newParticles.slice(-6)
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', isDark)
  }, [isDark])

  const currentNode = storyNodes.find(node => node.id === currentNodeId)
  const theme = emotionThemes[currentEmotion]
  const IconComponent = theme.icon

  const handleChoice = (choice: { text: string; nextId: string; emotionImpact: EmotionType }) => {
    setCurrentNodeId(choice.nextId)
    setCurrentEmotion(choice.emotionImpact)
    setEmotionHistory(prev => [...prev, choice.emotionImpact])
  }

  const resetGame = () => {
    setCurrentNodeId('start')
    setCurrentEmotion('neutral')
    setGameStarted(false)
    setEmotionHistory([])
    setParticles([])
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <motion.h1 
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Connections
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-700 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            An interactive story about friendship, loneliness, and the courage to connect. 
            Your choices will shape Alex's emotional journey and the atmosphere around them.
          </motion.p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Friendship</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <span>Connection</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4" />
              <span>Emotions</span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={() => setGameStarted(true)}
              className="text-lg px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              Begin Alex's Journey
            </Button>
          </motion.div>
          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => setIsDark(!isDark)}
              className="text-sm"
            >
              {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDark ? theme.darkBackground : theme.background} transition-all duration-1000 relative overflow-hidden`}>
      {/* Floating particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0.8],
              y: [0, -50, -100]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
          >
            {theme.particles}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Emotion indicator */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentEmotion}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <IconComponent className={`w-8 h-8 ${isDark ? theme.darkTextColor : theme.textColor}`} />
              <span className={`text-lg font-medium ${isDark ? theme.darkTextColor : theme.textColor}`}>
                {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
              </span>
            </div>
            <p className={`text-sm ${isDark ? theme.darkTextColor : theme.textColor} opacity-75`}>
              {theme.description}
            </p>
          </motion.div>

          {/* Story content */}
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className={`${isDark ? 'bg-black/20 border-white/20' : 'bg-white/30 border-white/50'} backdrop-blur-sm shadow-xl`}>
              <CardContent className="p-8">
                <p className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {currentNode?.text}
                </p>
                
                {currentNode?.isEnding ? (
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {currentEmotion === 'happy' ? 'A New Chapter Begins' : 'The Journey Continues'}
                      </h3>
                      <div className="mb-6">
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                          Your emotional journey:
                        </p>
                        <div className="flex justify-center gap-1">
                          {emotionHistory.map((emotion, index) => {
                            const emotionTheme = emotionThemes[emotion]
                            const EmotionIcon = emotionTheme.icon
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <EmotionIcon className={`w-5 h-5 ${isDark ? emotionTheme.darkTextColor : emotionTheme.textColor}`} />
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                      <Button 
                        onClick={resetGame}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      >
                        Start a New Journey
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentNode?.choices.map((choice, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <Button
                          onClick={() => handleChoice(choice)}
                          variant="outline"
                          className={`w-full text-left justify-start p-4 h-auto ${
                            isDark 
                              ? 'bg-white/5 hover:bg-white/10 text-white border-white/20' 
                              : 'bg-white/60 hover:bg-white/80 text-gray-800 border-gray-200'
                          } transition-all duration-300 hover:shadow-lg`}
                        >
                          <span className="text-sm font-medium">
                            {choice.text}
                          </span>
                          <div className="ml-auto">
                            {React.createElement(emotionThemes[choice.emotionImpact].icon, { 
                              className: `w-4 h-4 ${isDark ? emotionThemes[choice.emotionImpact].darkTextColor : emotionThemes[choice.emotionImpact].textColor}` 
                            })}
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme toggle */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setIsDark(!isDark)}
              className={`${isDark ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-white/60 hover:bg-white/80 text-gray-800 border-gray-200'}`}
            >
              {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
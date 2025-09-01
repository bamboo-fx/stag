import { useState, useEffect } from 'react'
import './App.css'
import Rankings from './components/Rankings'
import { submitVotes, generateUserId } from './services/rankingService'

const players = [
  { name: "Miles Demarest", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Demarest8181.jpg" },
  { name: "Lucius Ng", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Ng8157.jpg" },
  { name: "Daniel Kotkosky", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Kokotsky7861.jpg" },
  { name: "Taishi Liu", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Liu8121.jpg" },
  { name: "Ian Rodriguez", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Rodriguez7826.jpg" },
  { name: "Zeno Bang", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/22/Bang7695.jpg" },
  { name: "Eric Grossman-Glover", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/GrossmanGlover7757.jpg" },
  { name: "Roby Hooper", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Hooper7774.jpg" },
  { name: "James Gomez", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Gomez7654.jpg" },
  { name: "Christopher Kim", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Kim8091.jpg" },
  { name: "Alex Sondergaard", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Sondegaard8198.jpg" },
  { name: "Collin Ross", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Ross7740.jpg" },
  { name: "Shaan Malik", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Malik7707.jpg" },
  { name: "Ben Bacdayan", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Bacdayan8215.jpg" },
  { name: "Henry Otte", image: "https://cmsathletics.org/images/2025/8/21/Otte7878.jpg" },
  { name: "Atticus English", image: "https://cmsathletics.org/images/2025/8/21/English7955.jpg" },
  { name: "Kevin Xia", image: "https://cmsathletics.org/images/2025/8/21/Xia8052.jpg" },
  { name: "Heiko Schultz", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Schultz8140.jpg" },
  { name: "Dane Knudsen", image: "https://cmsathletics.org/images/2025/8/21/Knudsen7793.jpg" },
  { name: "Niall Connor", image: "https://cmsathletics.org/images/2025/8/21/Connor7897.jpg" },
  { name: "Bo Gardner", image: "https://cmsathletics.org/images/2025/8/21/Gardner7672.jpg" },
  { name: "Clayton Thomas", image: "https://cmsathletics.org/images/2025/8/21/Thomas7811.jpg" },
  { name: "Trusten Lehmann-Karp", image: "https://cmsathletics.org/images/2025/8/21/LehmannKarp8036.jpg" },
  { name: "Gray Mollenkamp", image: "https://cmsathletics.org/images/2025/8/21/Mollenkamp8018.jpg" },
  { name: "Daniel Zhu", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Zhu8143.jpg" },
  { name: "John Laidlaw", image: "https://cmsathletics.org/images/2025/8/21/Laidlaw8069.jpg" },
  { name: "Leica Yasukawa", image: "https://cmsathletics.org/images/2025/8/21/Yasukawa7987.jpg" },
  { name: "Paxton Greene", image: "https://cmsathletics.org/images/2025/8/21/Greene7972.jpg" },
  { name: "Penn Kaplan", image: "https://cmsathletics.org/images/2025/8/21/Kaplan7844.jpg" },
  { name: "Nico McKee", image: "https://cmsathletics.org/images/2025/8/21/McKee7935.jpg" },
  { name: "Tomas Bellatin", image: "https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/images/2025/8/21/Bellatin8003.jpg" },
  { name: "Sean Lee", image: "https://cmsathletics.org/images/2025/8/21/Lee7914.jpg" },
  { name: "Matteo Quadrini", image: "https://cmsathletics.org/images/2025/8/21/Quadrini8105.jpg" }
]

function App() {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [shuffledPlayers, setShuffledPlayers] = useState([])
  const [results, setResults] = useState({ chopped: [], notChopped: [] })
  const [showResults, setShowResults] = useState(false)
  const [showRankings, setShowRankings] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [submittingVotes, setSubmittingVotes] = useState(false)
  const [userId] = useState(() => generateUserId())

  useEffect(() => {
    const shuffled = [...players].sort(() => Math.random() - 0.5)
    setShuffledPlayers(shuffled)
  }, [])

  const handleChoice = (choice) => {
    const currentPlayer = shuffledPlayers[currentPlayerIndex]
    
    if (choice === 'chopped') {
      setResults(prev => ({ ...prev, chopped: [...prev.chopped, currentPlayer] }))
    } else {
      setResults(prev => ({ ...prev, notChopped: [...prev.notChopped, currentPlayer] }))
    }

    if (currentPlayerIndex + 1 >= shuffledPlayers.length) {
      setShowResults(true)
    } else {
      setCurrentPlayerIndex(prev => prev + 1)
    }
  }

  const resetApp = () => {
    const shuffled = [...players].sort(() => Math.random() - 0.5)
    setShuffledPlayers(shuffled)
    setCurrentPlayerIndex(0)
    setResults({ chopped: [], notChopped: [] })
    setShowResults(false)
    setShowRankings(false)
    setGameStarted(false)
    setOnboardingStep(0)
    setSubmittingVotes(false)
  }

  const handleSubmitToRankings = async () => {
    setSubmittingVotes(true)
    try {
      const result = await submitVotes(results, userId)
      if (result.success) {
        console.log('Votes submitted successfully:', result.sessionId)
      } else {
        console.error('Failed to submit votes:', result.error)
      }
    } catch (error) {
      console.error('Error submitting votes:', error)
    }
    setSubmittingVotes(false)
  }

  const showGlobalRankings = () => {
    setShowRankings(true)
  }

  const hideRankings = () => {
    setShowRankings(false)
  }

  const nextOnboardingStep = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(prev => prev + 1)
    } else {
      setGameStarted(true)
    }
  }

  const startGame = () => {
    setGameStarted(true)
  }

  // Show rankings if requested
  if (showRankings) {
    return <Rankings onBack={hideRankings} />
  }

  // Onboarding Flow
  if (!gameStarted) {
    if (onboardingStep === 0) {
      return (
        <div className="onboarding-container">
          <div className="onboarding-content">
            <h1 className="onboarding-title">Chopped or Not</h1>
            <div className="stags-logo">🦌</div>
            <p className="onboarding-subtitle">Rate your CMS Soccer teammates</p>
            <p className="onboarding-description">
              Swipe through each player and decide: are they chopped or not chopped?
            </p>
            <div className="onboarding-buttons">
              <button className="onboarding-btn" onClick={nextOnboardingStep}>
                Let's Go
              </button>
              <button className="onboarding-btn secondary" onClick={showGlobalRankings}>
                🏆 View Rankings
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (onboardingStep === 1) {
      return (
        <div className="onboarding-container">
          <div className="onboarding-content">
            <h2 className="onboarding-title">How to Play</h2>
            <div className="demo-buttons">
              <button className="demo-btn not-chopped-demo">Not Chopped</button>
              <button className="demo-btn chopped-demo">Chopped</button>
            </div>
            <p className="onboarding-description">
              See a player you like? Hit <strong>Not Chopped</strong><br/>
              Think they should be cut? Hit <strong>Chopped</strong>
            </p>
            <button className="onboarding-btn" onClick={nextOnboardingStep}>
              Got It
            </button>
          </div>
        </div>
      )
    }

    if (onboardingStep === 2) {
      return (
        <div className="onboarding-container">
          <div className="onboarding-content">
            <h2 className="onboarding-title">Ready to Start?</h2>
            <div className="stags-logo big">🦌</div>
            <p className="onboarding-description">
              You'll rate all <strong>{players.length} players</strong> from the CMS Men's Soccer team
            </p>
            <button className="onboarding-btn primary" onClick={startGame}>
              Start Rating
            </button>
          </div>
        </div>
      )
    }
  }

  if (showResults) {
    return (
      <div className="results-container">
        <h1>Results</h1>
        <div className="results-grid">
          <div className="result-column chopped">
            <h2>Chopped ({results.chopped.length})</h2>
            <div className="player-list">
              {results.chopped.map((player, index) => (
                <div key={index} className="player-item">{player.name}</div>
              ))}
            </div>
          </div>
          <div className="result-column not-chopped">
            <h2>Not Chopped ({results.notChopped.length})</h2>
            <div className="player-list">
              {results.notChopped.map((player, index) => (
                <div key={index} className="player-item">{player.name}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="results-actions">
          <button 
            className="submit-btn" 
            onClick={handleSubmitToRankings}
            disabled={submittingVotes}
          >
            {submittingVotes ? 'Submitting...' : '📊 Submit to Rankings'}
          </button>
          <button className="rankings-btn" onClick={showGlobalRankings}>
            🏆 View Global Rankings
          </button>
          <button className="reset-btn" onClick={resetApp}>
            🔄 Play Again
          </button>
        </div>
      </div>
    )
  }

  if (shuffledPlayers.length === 0) {
    return <div className="loading">Loading players...</div>
  }

  const currentPlayer = shuffledPlayers[currentPlayerIndex]
  const progress = ((currentPlayerIndex + 1) / shuffledPlayers.length) * 100

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Chopped or Not</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          {currentPlayerIndex + 1} / {shuffledPlayers.length}
        </div>
      </header>

      <div className="player-card">
        <div className="player-avatar">
          <img 
            src={currentPlayer.image} 
            alt={currentPlayer.name}
            className="player-photo"
            onLoad={(e) => {
              console.log('Image loaded successfully:', currentPlayer.name)
              e.target.style.display = 'block'
              e.target.nextSibling.style.display = 'none'
            }}
            onError={(e) => {
              console.log('First URL failed for:', currentPlayer.name, 'trying alternative...')
              // Try original CMS URL format as fallback
              const originalUrl = currentPlayer.image.replace('https://dbukjj6eu5tsf.cloudfront.net/sidearm.sites/claremontmuddscrippsc.sidearmsports.com/', 'https://cmsathletics.org/')
              if (e.target.src !== originalUrl) {
                e.target.src = originalUrl
              } else {
                console.log('All image URLs failed for:', currentPlayer.name)
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }
            }}
          />
          <div className="avatar-placeholder" style={{display: 'flex'}}>
            {currentPlayer.name.split(' ').map(name => name[0]).join('')}
          </div>
        </div>
        <h2 className="player-name">{currentPlayer.name}</h2>
      </div>

      <div className="button-container">
        <button 
          className="choice-btn not-chopped-btn"
          onClick={() => handleChoice('notChopped')}
        >
          Not Chopped
        </button>
        <button 
          className="choice-btn chopped-btn"
          onClick={() => handleChoice('chopped')}
        >
          Chopped
        </button>
      </div>
    </div>
  )
}

export default App

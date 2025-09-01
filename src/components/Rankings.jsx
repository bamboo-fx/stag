import { useState, useEffect } from 'react'
import { getRankings } from '../services/rankingService'
import './Rankings.css'

function Rankings({ onBack }) {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    setLoading(true)
    const data = await getRankings()
    setRankings(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="rankings-container">
        <div className="rankings-loading">Loading rankings...</div>
      </div>
    )
  }

  return (
    <div className="rankings-container">
      <header className="rankings-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Global Rankings</h1>
        <p className="rankings-subtitle">Most Chopped Players</p>
      </header>

      <div className="rankings-list">
        {rankings.map((player, index) => (
          <div key={player.id} className="ranking-item">
            <div className="ranking-position">#{index + 1}</div>
            
            <div className="ranking-player">
              <div className="ranking-avatar">
                <img 
                  src={player.image} 
                  alt={player.name}
                  className="ranking-photo"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="ranking-placeholder" style={{display: 'none'}}>
                  {player.name.split(' ').map(name => name[0]).join('')}
                </div>
              </div>
              
              <div className="ranking-info">
                <h3 className="ranking-name">{player.name}</h3>
                <div className="ranking-stats">
                  <span className="total-votes">{player.totalVotes} votes</span>
                  <span className="vote-breakdown">
                    {player.choppedVotes} chopped, {player.notChoppedVotes} not chopped
                  </span>
                </div>
              </div>
            </div>

            <div className="ranking-percentage">
              <div className="percentage-circle" style={{
                background: `conic-gradient(#ff4757 0deg ${player.choppedPercentage * 3.6}deg, #f1f2f6 ${player.choppedPercentage * 3.6}deg 360deg)`
              }}>
                <span>{player.choppedPercentage}%</span>
              </div>
              <div className="percentage-label">Chopped</div>
            </div>
          </div>
        ))}
      </div>

      {rankings.length === 0 && (
        <div className="no-rankings">
          <p>No rankings yet. Be the first to vote!</p>
        </div>
      )}

      <button className="refresh-btn" onClick={fetchRankings}>
        🔄 Refresh Rankings
      </button>
    </div>
  )
}

export default Rankings
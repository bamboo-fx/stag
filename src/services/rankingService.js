import { db } from '../firebase'
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, increment } from 'firebase/firestore'

export const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

export const submitVotes = async (results, userId) => {
  try {
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
    
    // Save session data
    await setDoc(doc(db, 'sessions', sessionId), {
      userId,
      timestamp: new Date(),
      results: {
        chopped: results.chopped.map(p => ({ name: p.name, image: p.image })),
        notChopped: results.notChopped.map(p => ({ name: p.name, image: p.image }))
      }
    })

    // Update rankings for each player
    const allPlayers = [...results.chopped, ...results.notChopped]
    
    for (const player of allPlayers) {
      const playerRef = doc(db, 'rankings', player.name.replace(/\s+/g, '_').toLowerCase())
      const playerDoc = await getDoc(playerRef)
      
      const isChopped = results.chopped.some(p => p.name === player.name)
      
      if (playerDoc.exists()) {
        // Update existing player
        await updateDoc(playerRef, {
          totalVotes: increment(1),
          choppedVotes: increment(isChopped ? 1 : 0),
          notChoppedVotes: increment(isChopped ? 0 : 1)
        })
      } else {
        // Create new player record
        await setDoc(playerRef, {
          name: player.name,
          image: player.image,
          totalVotes: 1,
          choppedVotes: isChopped ? 1 : 0,
          notChoppedVotes: isChopped ? 0 : 1
        })
      }
    }
    
    return { success: true, sessionId }
  } catch (error) {
    console.error('Error submitting votes:', error)
    return { success: false, error: error.message }
  }
}

export const getRankings = async () => {
  try {
    const rankingsQuery = query(collection(db, 'rankings'), orderBy('totalVotes', 'desc'))
    const querySnapshot = await getDocs(rankingsQuery)
    
    const rankings = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const choppedPercentage = data.totalVotes > 0 ? Math.round((data.choppedVotes / data.totalVotes) * 100) : 0
      
      rankings.push({
        id: doc.id,
        ...data,
        choppedPercentage
      })
    })
    
    // Sort by chopped percentage (most chopped first)
    return rankings.sort((a, b) => b.choppedPercentage - a.choppedPercentage)
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return []
  }
}

export const getPlayerStats = async (playerName) => {
  try {
    const playerId = playerName.replace(/\s+/g, '_').toLowerCase()
    const playerRef = doc(db, 'rankings', playerId)
    const playerDoc = await getDoc(playerRef)
    
    if (playerDoc.exists()) {
      const data = playerDoc.data()
      return {
        ...data,
        choppedPercentage: data.totalVotes > 0 ? Math.round((data.choppedVotes / data.totalVotes) * 100) : 0
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching player stats:', error)
    return null
  }
}
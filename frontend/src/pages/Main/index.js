import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import io from 'socket.io-client'

import './styles.css';

import logo from '../../assets/logo.svg'
import like from '../../assets/like.svg'
import dislike from '../../assets/dislike.svg'
import itsamatch from '../../assets/itsamatch.png'

import api from '../../services/api'

export default function Main({ match }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [matchDev, setMatchDev] = useState(null)

  useEffect(() => {
    const socket = io('http://localhost:1337', {
      query: { user: match.params.id }
    })
    socket.on('match', dev => {
      setMatchDev(dev)
    })
  }, [match.params.id])

  useEffect(() => {
    async function loadUsers() {
      setLoading(true)
      const response = await api.get(`/devs`, {
        headers: { user: match.params.id }
      })
      setLoading(false)
      setUsers(response.data)
    }

    loadUsers()
  }, [match.params.id])

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id }
    })

    setUsers(users.filter(user => user._id !== id))
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id }
    })

    setUsers(users.filter(user => user._id !== id))
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev"/>
      </Link>
      { users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name}/>
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>
              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike"/>
                </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="like"/>
                </button>            
              </div>
            </li>                     
          ))}
        </ul>
      ) : (
        <div className="empty">
          { loading ? (
            'Carregando...'
          ) : (
            'Acabou :('
          )}
        </div>
      )}

      { matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="It's a match!" />
          <img className="avatar" src={matchDev.avatar} alt="Avatar"/>
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
        </div> 
      )}
    </div>
  );
}

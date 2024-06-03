import React from 'react'
import '../css/Main.css'

import {Link } from 'react-router-dom'
import Users from './users'
import Posts from './Posts'
export default function Main() {
  
  return (
    <div className='story_post'>
    <div className='main'>
        <div className="viewport">
      <ul className="list">

{Users.map((user) => (
  <li className='item'>
          <img className='story_profile' src={user.image_url}/>
          <p>{user.username.length > 10 ? user.username.slice(0, 10) + '...' : user.username}</p>
        </li>
      ))}

      </ul>
      </div>
      </div>
      <div>
        <Posts/>
      </div>

    
    </div>
  )
}

import { useEffect, useRef, useState } from 'react';
import axios from "axios";

const WebSock = () => {
  const socket = useRef()

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [connected, setConnected] = useState(false)
  const [username, setUsername] = useState('')

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:5000')

    socket.current.onopen = () => {
      setConnected(true)  

      const message = {
        event: 'connection',
        username,
        id: Date.now()
      }

      socket.current.send(JSON.stringify(message))

      console.log('Connect adds');
    }

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages((prev) => [message, ...prev])
    }

    socket.current.onclose = () => {

    }

    socket.current.onerror = () => {
      console.log('socket error');
    }
  }

  const sendMessage = async () => {
    const message = {
      username,
      message: inputValue,
      id: Date.now(),
      event: 'message'  
    }

    socket.current.send(JSON.stringify(message))

    setInputValue('')
  }

  if(!connected) {
    return (
      <div className='center'>
        <div className='form'>
          <input 
          value={username} 
          type="text" 
          onChange={(event) => setUsername(event.target.value)}  
          placeholder='Enter your name'/>
          <button onClick={connect}>Submit</button>
        </div>
      </div>
    )
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input value={inputValue} onChange={e => setInputValue(e.target.value)} type="text" />
          <button onClick={sendMessage}>Отправить</button>
        </div>
        <div className="messages">
          {messages.map(mess =>
            <div key={mess.id}>
              {mess.event === 'connection'
                ? <div className='connection_message'>
                    User {mess.username} connection
                  </div>
                : <div className='message'>
                    {mess.username}: {mess.message}
                  </div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSock; 
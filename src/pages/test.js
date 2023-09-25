import { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
let socket

const Home = () => {
    const [input, setInput] = useState('')
    const [chat, setChat] = useState([])
    const [name, setName] = useState()
    const nameRef = useRef(name)
    const chatRef = useRef(chat)
    
    useEffect(() => {
        socketInitializer()
    }, [])

    const socketInitializer = async () => {
        await fetch('https://b2b-data-real-time.hellomuto.repl.co/socket');
        socket = io("https://b2b-data-real-time.hellomuto.repl.co/");

        socket.on('connect', () => {
            console.log('connected')
        })
        
        socket.on('update-input', (newChat) => {
            if(nameRef.current !== newChat.from) {
                setChat([...chatRef.current, newChat])
            }
        })
    }

    const onChangeHandler = (e) => {
        if (e.key === 'Enter') {
            setInput(e.target.value)
            const message = {
                msg: e.target.value,
                from: name
            }
            const newChat = [...chat, message]
            setChat(newChat)
            chatRef.current = newChat
            socket.emit('input-change', message)
        }
    }

    return (
        <>
        <input
                placeholder="Type something"
                onKeyDown={(e) => {
                    setName(e.target.value);
                    nameRef.current = e.target.value
                }}
            />
            <input
                placeholder="Type something"
                onKeyDown={onChangeHandler}
            />

            <div className='chat'>
                <h2>{name}</h2>
                {
                    chat.map((ch,i) => {
                        return (
                            <p key={i+1}>{ch.msg}</p>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Home;
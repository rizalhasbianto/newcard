import { useEffect, useState } from 'react'
import io from 'socket.io-client'
let socket

const Home = () => {
    const [input, setInput] = useState('')
    const [chat, setChat] = useState([])

    useEffect(() => {
        socketInitializer()
    }, [])

    const socketInitializer = async () => {
        await fetch('/api/socket');
        socket = io()

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on('update-input', newChat => {
            setChat(newChat)
        })
    }

    const onChangeHandler = (e) => {
        if (e.key === 'Enter') {
            setInput(e.target.value)
            const message = {
                msg: e.target.value
            }
            const newChat = [...chat, message]
            setChat(newChat)
            socket.emit('input-change', newChat)
        }
    }
console.log("chat", chat)
    return (
        <>
            <input
                placeholder="Type something"
                onKeyDown={onChangeHandler}
            />
            <div className='chat'>
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
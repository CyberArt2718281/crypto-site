import { useCallback, useEffect, useState, useRef } from 'react';
import style from './Chat.module.css';
import { ChatMessage, Message, MessageType, SystemMessageType } from './message';
import io from 'socket.io-client';

const ChatIconSVG = () => (
    <svg viewBox="0 0 24 24">
      <path d="M12 3C6.486 3 2 6.364 2 10.5c0 2.742 1.982 5.354 5 6.678V21l4.5-2.5c.836.227 1.735.353 2.7.353 5.514 0 10-3.364 10-7.5S17.514 3 12 3zm1 11h-2v-2h2v2zm0-4h-2V6h2v4z"/>
    </svg>
);

export default function Chat() {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const chat = io('wss://potato.ipv6b.my.id:2096', {
      transports: ['websocket', 'polling'],
    });

    chat.on('connect', () => {
      setSocket(chat);
      console.log('connected to chat');
    });

    chat.on('disconnect', () => {
      setSocket(null);
      console.log('disconnected from chat');
      setMessages((prev) => [...prev, {type: 'system', data: {text: 'You were disconnected from chat!', timestamp: (new Date()).toISOString()}}])
    });

    chat.on('system', (systemMsg: SystemMessageType) => {
      setMessages((prev) => [...prev, { type: 'system', data: systemMsg }]);
    });

    chat.on('message', (msg: MessageType) => {
      setMessages((prev) => [...prev, { type: 'message', data: msg }]);
    });

    return () => {
      chat.disconnect();
    };
  }, []);

  const sendMessage = useCallback(async () => {
    if (!socket || !inputText.trim()) return;

    if (inputText.startsWith('/name ')) {
      const nn = inputText.substring('/name '.length).trim();
      if (!nn) return;
      setNickname(nn);
      socket.emit('set_username', { username: nn });
      setInputText(''); // Очищаем поле ввода после установки имени
    } else {
      if (!nickname) {
        alert('Set nickname first!\n\nUse `/name` command in chat, e.g.:\n\n/name RandomNameLol');
        setInputText('/name ');
        return;
      }
      socket.emit('message', { text: inputText.trim() });
      setInputText('');
    }
  }, [socket, inputText, nickname]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
      <div className={style.chatContainer}>
        <div className={`${style.chat} ${isOpen ? style.open : ''}`}>
          <h3>Chat section</h3>
          <div className={style.history}>
            {messages.map((msg, i) => (
                <Message key={'chat-message-no-' + i} type={msg.type} data={msg.data} />
            ))}
          </div>
          <div className={style.input}>
            <input
                ref={inputRef}
                type="text"
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} disabled={!inputText.trim()}>Send</button>
          </div>
        </div>
        <div className={style.chatIcon} onClick={toggleChat}>
          <ChatIconSVG />
        </div>
      </div>
  );
}
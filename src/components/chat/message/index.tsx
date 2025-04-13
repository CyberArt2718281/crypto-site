import style from './Message.module.css';

export type MessageType = {
  text: string;
  username?: string;
  timestamp: string;
};

export type SystemMessageType = {
  text: string;
  timestamp: string;
};

export type ChatMessage = {
  type: 'message' | 'system';
  data: MessageType | SystemMessageType;
};

export function Message(props: Readonly<ChatMessage>) {
  return (
    <>
      {props.type === 'system' ? (
        <div className={style.notification}>
          {props.data.text} ({new Date(props.data.timestamp).toLocaleTimeString()})
        </div>
      ) : (
        <div className={style.userMsg}>
          <div>
            <b>{(props.data as MessageType).username}</b> said (at <small>{new Date(props.data.timestamp).toLocaleString()}</small>): <br />
          </div>
          <div>
            {props.data.text}
          </div>
        </div>
      )}
    </>
  );
}

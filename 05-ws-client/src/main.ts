import { connectToServer } from './socket-client';
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
   <h2>Websocket - Client</h2>

   <input id="jwt-token" placeholder="Json Web Token"/>
   <button id="btn-connect">Connect</button>

   <br/>
   <span id="server-status">Offline</span>

   <ul id="clients-ul"></ul>

   <form id="message-form">
    	<input placeholder="message" id="message-input"/>
   </form>

   <h3>Messages</h3>
   <ul id="messages-ul"></ul>
  </div>
`;

// connectToServer();

const inputJwt = document.querySelector<HTMLInputElement>('#jwt-token')!;
const btnConnect = document.querySelector('#btn-connect')!;

btnConnect.addEventListener('click', () => {
  const jwt = inputJwt.value.trim();
  if (!jwt) {
    return alert('Enter a valid JWT');
  }
  connectToServer(jwt);
});
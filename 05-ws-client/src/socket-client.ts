
import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (token: string) => {
    // http://localhost:3000/socket.io/socket.io.js

    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            authentication: token
        }
    });

    socket?.removeAllListeners();
    socket = manager.socket('/');

    addListeners();
}

const addListeners = () => {
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientsUl = document.querySelector('#clients-ul')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

    // TODO: clients-ul

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'Connected';
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'Disconnected';
    });
    
    socket.on('clients-updated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml += `
            <li>${ clientId }</li>
            `;
        });

        clientsUl.innerHTML = clientsHtml;
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!messageInput.value.trim()) {
            return;
        }
        
        socket.emit('message-form-client', {
            id: 'yooo',
            message: messageInput.value
        });
        
        messageInput.value = '';
    });
    
    socket.on('message-from-server', (payload: { fullName: string, message: string }) => {
        const newMessage = `
        <li>
            <strong>${ payload.fullName }</strong>
            <span>${ payload.message }</span>
        </li>`;

        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messageUl.append(li);
    });

    socket.on('get-old-messages', (payloads: { fullName: string, message: string }[]) => {
        messageUl.innerHTML = '';
        for (const payload of payloads) {
            const newMessage = `
            <li>
                <strong>${ payload.fullName }</strong>
                <span>${ payload.message }</span>
            </li>`;
    
            const li = document.createElement('li');
            li.innerHTML = newMessage;
            messageUl.append(li);
        }
    });
}
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    }
}

interface Message { 
    fullName: string;
    message: string;
}

@Injectable()
export class MessageWsService {

    private connectedClients: ConnectedClients = {};
    private messages: Message[] = [];

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.isActive) {
            throw new Error('User not active');
        }

        this.checkUserConnection(user);

        this.connectedClients[client.id] = {
            socket: client,
            user
        };
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients);
    }

    addMessage(message: Message) {
        this.messages.push(message);
    }

    getMessages() {
        return this.messages;
    }

    getUserFullName(socketId: string) {
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserConnection(user: User) {
        for (const clientId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[clientId];

            if (connectedClient.user.id == user.id) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }
}

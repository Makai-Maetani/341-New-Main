import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './messages.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	// Event emitter to notify components of changes
	messageChangedEvent = new EventEmitter<Message[]>();

	private messages: Message[] = [];

	constructor() {
		this.messages = MOCKMESSAGES;
	}

	// Get all messages
	getMessages(): Message[] {
		return this.messages.slice(); // return a copy
	}

	// Get a single message by id
	getMessage(id: string): Message | undefined {
		return this.messages.find(m => m.id === id);
	}

	// Add a new message
	addMessage(message: Message): void {
		this.messages.push(message);
		// Emit updated message list
		this.messageChangedEvent.emit(this.messages.slice());
	}
}


import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './messages.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	// Event emitter to notify components of changes
	messageChangedEvent = new EventEmitter<Message[]>();

	private messages: Message[] = [];
	maxMessageId: number = 0;
	private firebaseUrl = 'https://w09database-default-rtdb.firebaseio.com/messages.json';

	constructor(private http: HttpClient) {
		this.messages = [];
		this.maxMessageId = 0;
		this.getMessages();
	}

	// Get all messages
	getMessages(): Message[] {
		this.http.get<Message[]>(this.firebaseUrl)
			.subscribe(
				(messages: Message[]) => {
					this.messages = messages || [];
					this.maxMessageId = this.getMaxId();
					this.messageChangedEvent.emit(this.messages.slice());
				},
				(error: any) => {
					console.error('Error fetching messages from server:', error);
				}
			);
		return this.messages.slice();
	}

	// Get a single message by id
	getMessage(id: string): Message | undefined {
		return this.messages.find(m => m.id === id);
	}

	// Add a new message
	addMessage(message: Message): void {
		if (!message) return;
		this.maxMessageId++;
		message.id = this.maxMessageId.toString();
		this.messages.push(message);
		this.storeMessages();
	}

	getMaxId(): number {
		let maxId = 0;
		for (const m of this.messages) {
			const currentId = parseInt(m.id as any, 10);
			if (!isNaN(currentId) && currentId > maxId) maxId = currentId;
		}
		return maxId;
	}

	storeMessages(): void {
		const body = JSON.stringify(this.messages);
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		this.http.put(this.firebaseUrl, body, { headers })
			.subscribe(() => {
				this.messageChangedEvent.emit(this.messages.slice());
			}, (error) => {
				console.error('Error storing messages to server:', error);
			});
	}
}


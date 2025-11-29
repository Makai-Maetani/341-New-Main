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
	private nodeServerUrl = 'http://localhost:3000/messages';

	constructor(private http: HttpClient) {
		this.messages = [];
		this.maxMessageId = 0;
		this.getMessages();
	}

	// Get all messages
	getMessages(): Message[] {
		this.http.get<{ message: string, messages: Message[] }>(this.nodeServerUrl)
			.subscribe(
				(response) => {
					this.messages = response.messages || [];
					this.messageChangedEvent.emit(this.messages.slice());
				},
				(error: any) => {
					console.error('Error fetching messages from server:', error);
				}
			);
		return this.messages.slice();
	}

	// Add a new message
	addMessage(message: Message): void {
		if (!message) {
			return;
		}

		message.id = '';

		const headers = new HttpHeaders({'Content-Type': 'application/json'});

		this.http.post<{ message: string, newMessage: Message }>(this.nodeServerUrl,
			message,
			{ headers: headers })
			.subscribe(
				(responseData) => {
					this.messages.push(responseData.newMessage);
					this.messageChangedEvent.emit(this.messages.slice());
				}
			);
	}

	// Get a single message by id
	getMessage(id: string): Message | undefined {
		return this.messages.find(m => m.id === id);
	}

	private getMaxId(): number {
		let maxId = 0;
		for (const m of this.messages) {
			const currentId = parseInt(m.id as any, 10);
			if (!isNaN(currentId) && currentId > maxId) maxId = currentId;
		}
		return maxId;
	}
}


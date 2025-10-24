import { Component, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../messages.model';
import { MessageService } from '../messages.service';
@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.html',
  styleUrls: ['./message-edit.css']
})
export class MessageEditComponent {
  @ViewChild('subject') subjectInput!: ElementRef;
  @ViewChild('msgText') msgTextInput!: ElementRef;
  currentSender = 'Your Name';
  onSendMessage() {
    const subject = this.subjectInput.nativeElement.value;
    const msgText = this.msgTextInput.nativeElement.value;
    const newMessage = new Message(Date.now().toString(), this.currentSender, subject, msgText);
    // Save the new message to the service so it persists application-wide
    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  constructor(private messageService: MessageService) {}

  onClear() {
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }
}

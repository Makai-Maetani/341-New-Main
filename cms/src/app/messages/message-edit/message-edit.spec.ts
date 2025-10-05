import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageEditComponent } from './message-edit';

describe('MessageEdit', () => {
  let component: MessageEditComponent;
  let fixture: ComponentFixture<MessageEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

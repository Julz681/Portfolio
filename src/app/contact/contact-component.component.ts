import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-component.component.html',
  styleUrls: ['./contact-component.component.scss']
})
export class ContactComponent {
  onSubmit() {
    console.log('Form submitted!');
  }
}

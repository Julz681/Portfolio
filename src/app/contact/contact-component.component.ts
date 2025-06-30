import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-component.component.html',
  styleUrls: ['./contact-component.component.scss']
})
export class ContactComponent {
  @Input() currentLang: 'en' | 'de' = 'en';

  formSubmitted = false;
  error = false;
  formInvalid = false;

  onSubmit(form: NgForm) {
    if (form.invalid || !form.value.privacy) {
      this.formInvalid = true;
      this.formSubmitted = false;
      return;
    }

    this.formInvalid = false;

    const formData = {
      name: form.value.name,
      email: form.value.email,
      message: form.value.message,
    };

    fetch('https://formspree.io/f/xeoknzgl', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        this.formSubmitted = true;
        this.error = !response.ok;
        if (response.ok) {
          form.reset();
        }
      })
      .catch(() => {
        this.formSubmitted = true;
        this.error = true;
      });
  }
}

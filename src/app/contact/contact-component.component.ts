import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-contact-component',
  standalone: true,
  imports: [CommonModule, FormsModule, PrivacyPolicyComponent],
  templateUrl: './contact-component.component.html',
  styleUrls: ['./contact-component.component.scss'],
})
export class ContactComponent {
  @Input() currentLang: 'en' | 'de' = 'en';

  showPolicy = false;
  formSubmitted = false;
  error = false;
  formInvalid = false;

  success = false;

  onSubmit(form: NgForm) {
    this.formSubmitted = true;
    this.success = false;

    if (form.invalid || !form.value.privacy) {
      return;
    }

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
        this.error = !response.ok;
        this.success = response.ok;

        if (response.ok) {
          form.resetForm();
          this.formSubmitted = false;
        }
      })
      .catch(() => {
        this.error = true;
      });
  }

  closePolicy() {
    this.showPolicy = false;
  }
}

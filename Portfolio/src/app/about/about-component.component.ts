import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-component.component.html',
  styleUrls: ['./about-component.component.scss'],
})
export class AboutComponent implements OnInit {
  @Input() currentLang: 'en' | 'de' = 'en';

  birthMonth = 1;
  birthYear = 1998;
  age: number = 0;

  ngOnInit(): void {
    this.age = this.calculateAge(this.birthYear, this.birthMonth);
  }

  calculateAge(year: number, month: number): number {
    const today = new Date();
    let age = today.getFullYear() - year;

    if (today.getMonth() < month) {
      age--;
    }

    return age;
  }
}

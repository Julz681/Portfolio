import { Component } from '@angular/core';

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [],
  templateUrl: './about-component.component.html',
  styleUrl: './about-component.component.scss',
})
export class AboutComponent {
  birthMonth = 1; // 0 = Januar, also 1 = Februar
  birthYear = 1998;
  age: number = 0;

  ngOnInit(): void {
    this.age = this.calculateAge(this.birthYear, this.birthMonth);
  }

  calculateAge(year: number, month: number): number {
    const today = new Date();
    let age = today.getFullYear() - year;

    // wenn aktueller Monat < Geburtsmonat → noch kein Geburtstag gehabt
    if (today.getMonth() < month) {
      age--;
    }

    return age;
  }
}

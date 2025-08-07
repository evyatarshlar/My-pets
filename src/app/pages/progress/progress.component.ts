import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  numbers: number[] = [];

  ngOnInit(): void {
    this.generateRandomNumbers();
  }

  private generateRandomNumbers(): void {
    this.numbers = [];
    for (let i = 0; i < 20; i++) {
      // Generate random number between 1 and 3
      const randomNum = Math.floor(Math.random() * 3) + 1;
      this.numbers.push(randomNum);
    }
  }
}

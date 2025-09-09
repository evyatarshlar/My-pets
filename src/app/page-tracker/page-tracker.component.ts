import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../services/audio.service';

interface Step {
  icon?: string;
  label?: string;
  completed?: boolean;
}

@Component({
  selector: 'page-tracker',
  imports: [CommonModule],
  templateUrl: './page-tracker.component.html',
  styleUrl: './page-tracker.component.scss'
})
export class PageTrackerComponent implements OnInit {
  currentPage: number = 0;
  currentStepIndex: number = 0;
  activeTooltipIndex: number | null = null;
  characterTop: string = '45px';
  characterLeft: string = '622px';
  isCharacterAnimationComplete = false;

  constructor(private audioService: AudioService) { }

  steps: Step[] = [
    { icon: '📖', label: "יום א'" },
    { icon: '📚', label: "יום ב'" },
    { icon: '✏️', label: "יום ג'" },
    { icon: '🎯', label: "יום ד'" },
    { icon: '🏆', label: "יום ה'" },
    { icon: '⭐', label: "יום ו'" },
    { label: "יום שבת" },
  ];

  ngOnInit() {
    this.loadProgressFromLocalStorage();
    this.animateCharacterToCurrentStep();
  }

  private loadProgressFromLocalStorage() {
    const savedPage = localStorage.getItem('learningTrackerState');
    if (savedPage) {
      try {
        const state = JSON.parse(savedPage);
        this.currentStepIndex = (state.currentPage ?? 1) - 1; //the spes here are by the page index
      } catch { }
    }
  }

  private async animateCharacterToCurrentStep() {
    this.isCharacterAnimationComplete = false;
    for (let i = 1; i <= this.currentStepIndex; i++) {
      await this.updateCharacterPosition(i);
      if (i < this.currentStepIndex) {
        this.audioService.playSounds('beep-3.mp3');
      } else {
        this.audioService.playSounds('success.mp3');
      }
      await this.delay(1100)
    }
    this.isCharacterAnimationComplete = true;
    const characterElement = document.querySelector('.character') as HTMLElement;
    if (characterElement) {
      characterElement.classList.add('animate-bounce');
    }
  }

  private updateCharacterPosition(stepIndex: number): Promise<void> {
    const characterElement = document.querySelector('.character') as HTMLElement;
    if (characterElement) {
      characterElement.classList.add('moving');
      setTimeout(() => characterElement.classList.remove('moving'), 1100);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentStepElement = document.querySelector(`.step-${stepIndex}`) as HTMLElement;
        if (currentStepElement) {
          const isMobile = window.innerWidth < 1024;
          if (isMobile) {
            this.characterTop = `${currentStepElement.offsetTop - 30}px`;
            this.characterLeft = `${currentStepElement.offsetLeft + 145}px`;
          } else {
            this.characterTop = `${currentStepElement.offsetTop - 35}px`;
            this.characterLeft = `${currentStepElement.offsetLeft + 4}px`;
          }
        }
        resolve();
      }, 150);
    });
  }


  // private updateCharacterPosition() {
  //   const characterElement = document.querySelector('.character') as HTMLElement;
  //   if (characterElement) {
  //     characterElement.classList.add('moving');
  //     setTimeout(() => characterElement.classList.remove('moving'), 2000);
  //   }

  //   // Use requestAnimationFrame for better timing
  //   requestAnimationFrame(() => {
  //     setTimeout(() => {
  //       const currentStepElement = document.querySelector(`.step-${this.currentStepIndex}`) as HTMLElement;
  //       if (currentStepElement) {
  //         const isMobile = window.innerWidth < 1024;
  //         // מיקום הדמות בהתאם לגודל המסך
  //         if (isMobile) {
  //           // במובייל - מיקום הדמות יותר קרוב לעיגול
  //           this.characterTop = `${currentStepElement.offsetTop - 30}px`;
  //           this.characterLeft = `${currentStepElement.offsetLeft + 145}px`;
  //         } else {
  //           // בדסקטופ - המיקום המקורי
  //           this.characterTop = `${currentStepElement.offsetTop - 35}px`;
  //           this.characterLeft = `${currentStepElement.offsetLeft + 4}px`;
  //         }
  //         // this.saveStateToStorage();
  //         if (this.currentStepIndex < 7) {
  //           this.audioService.playSounds('beep-3.mp3');
  //         }
  //         // Execute callback after position update
  //         // if (callback) {
  //         //   setTimeout(callback, 100); 
  //         // }
  //       }
  //     }, 150); // Increased delay for better DOM sync
  //   });
  // }

  resetLocalStorage() {
    localStorage.removeItem('currentPage');
    this.currentPage = 0;
    this.currentStepIndex = 0;
    // this.updateCharacterPosition();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStepPercent(i: number): number {
    // כרגע הרדקודד 33%
    return 33;
  }
}

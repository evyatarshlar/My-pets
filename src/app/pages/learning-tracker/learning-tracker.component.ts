import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../count-ap-directive';

// Interface for each learning step
interface LearningStep {
  icon?: string;
  label?: string;
}

@Component({
  selector: 'app-learning-tracker',
  standalone: true,
  imports: [CommonModule,CountUpDirective],
  templateUrl: './learning-tracker.component.html',
  styleUrls: ['./learning-tracker.component.scss'],
})
export class LearningTrackerComponent implements OnInit {
  steps: LearningStep[] = [
    { label: 'היום' },
    {},
    {},
    {},
    { label: 'מחר' },
    { icon: '🪙' },
    { icon: '📚' },
    { icon: '❓' },
    { icon: '🎁' },
  ];

  score = 0;
  level = 0;
  currentStepIndex = 0;
  characterTop = '0px';
  characterLeft = '0px';
  activeTooltipIndex: number | null = null;
  private oldNumberArray: string[] = ["0"]; ////// Store previous number state
    show25PercentMessage = false;

    isScrollComplete: boolean = false;

  // שמירה וטעינה של מצב הדמות והניקוד
  private saveStateToStorage() {
    localStorage.setItem('learningTrackerState', JSON.stringify({
      score: this.score,
      level: this.level,
      currentStepIndex: this.currentStepIndex,
      characterTop: this.characterTop,
      characterLeft: this.characterLeft
    }));
  }

  private loadStateFromStorage() {
    const stateStr = localStorage.getItem('learningTrackerState');
    if (stateStr) {
      try {
        const state = JSON.parse(stateStr);
        this.score = state.score ?? 0;
        this.level = state.level ?? 0;
        this.currentStepIndex = state.currentStepIndex ?? 0;
        this.characterTop = state.characterTop ?? '0px';
        this.characterLeft = state.characterLeft ?? '0px';
      } catch {}
    }
  }

  get shouldFlipCharacter(): boolean {
    const topValue = parseInt(this.characterTop.replace('px', ''));
    return topValue > 350;
  }

  ngOnInit(): void {
    this.loadStateFromStorage();
    this.updateCharacterPosition();
    setTimeout(() => {
      // כאן אפשר להפעיל אנימציה או עדכון נוסף אם צריך
      // this.updateScoreDisplay();
    }, 100);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const scrollPercent = (window.scrollY / scrollableHeight) * 100;
    const targetStep = Math.floor(scrollPercent / 25);

    if (targetStep > this.currentStepIndex) {
      const stepsToAdvance = targetStep - this.currentStepIndex;
      this.score += 50 * stepsToAdvance;
      this.level += stepsToAdvance;
      this.currentStepIndex = Math.min(targetStep, this.steps.length - 1);
      this.updateCharacterPosition();
      this.saveStateToStorage();
      setTimeout(() => {
        this.show25PercentMessage = true;
        setTimeout(() => {
          this.show25PercentMessage = false;
        }, 3000);
      }, 1000);
      // this.updateScoreDisplay();
    }

    // Set isScrollComplete to true if scrolled to 100% and current step is last
    this.isScrollComplete = scrollPercent >= 100 && this.currentStepIndex === this.steps.length - 1;
  }

  private updateCharacterPosition(): void {
    const characterElement = document.querySelector('.character') as HTMLElement;
    if (characterElement) {
      characterElement.classList.add('moving');
      setTimeout(() => characterElement.classList.remove('moving'), 700);
    }
    setTimeout(() => {
      const currentStepElement = document.querySelector(`.step-${this.currentStepIndex}`) as HTMLElement;
      if (currentStepElement) {
        this.characterTop = `${currentStepElement.offsetTop - 40}px`;
        this.characterLeft = `${currentStepElement.offsetLeft + 200}px`;
        this.saveStateToStorage();
      }
    }, 100);
  }

  // private updateScoreDisplay(): void {
  //   const scoreElement = document.querySelector('.numbers') as HTMLElement;
  //   if (scoreElement) {
  //     this.oldNumberArray = animateNumber(this.score, scoreElement, this.oldNumberArray);
  //   }
  // }
    closeCurrentTooltip() {
      this.isScrollComplete = false;
    }
}
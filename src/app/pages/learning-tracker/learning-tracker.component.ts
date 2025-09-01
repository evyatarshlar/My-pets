import { Component, HostListener, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../count-ap-directive';
import { FireworkManager } from '../firework.utils';

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
export class LearningTrackerComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  // Fireworks manager
  private fireworkManager!: FireworkManager;
  
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

  // משתנים עבור מערכת דפים
  currentPage: number = 1;
  totalStepsCompleted: number = 0; // סה"כ שלבים שהושלמו מכל הדפים

  // שמירה וטעינה של מצב הדמות והניקוד
  private saveStateToStorage() {
    localStorage.setItem('learningTrackerState', JSON.stringify({
      score: this.score,
      level: this.level,
      currentStepIndex: this.currentStepIndex,
      characterTop: this.characterTop,
      characterLeft: this.characterLeft,
      currentPage: this.currentPage,
      totalStepsCompleted: this.totalStepsCompleted
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
        this.currentPage = state.currentPage ?? 1;
        this.totalStepsCompleted = state.totalStepsCompleted ?? 0;
      } catch {}
    }
    
    // סנכרון עם מצב העמוד מ-progress component
    this.syncWithProgressPage();
  }

  get shouldFlipCharacter(): boolean {
    const topValue = parseInt(this.characterTop.replace('px', ''));
  return topValue > 350 || topValue <= 30;
  }

  ngOnInit(): void {
    this.loadStateFromStorage();
    this.updateCharacterPosition();
  }

  ngAfterViewInit() {
    // Small delay to ensure the canvas is properly rendered
    setTimeout(() => {
      const canvas = this.canvasRef?.nativeElement;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d')!;
        this.fireworkManager = new FireworkManager(canvas, ctx);
      }
    }, 100);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const scrollPercent = (window.scrollY / scrollableHeight) * 100;
    const targetStep = Math.floor(scrollPercent / 25) + ((this.currentPage - 1) * 4);

    if (targetStep > this.currentStepIndex) {
      const stepsToAdvance = targetStep - this.currentStepIndex;
      this.score += 50 * stepsToAdvance;
      this.level += stepsToAdvance;
      this.totalStepsCompleted += stepsToAdvance;
      this.currentStepIndex = Math.min(targetStep, this.steps.length - 1);
      this.updateCharacterPosition();
      this.saveStateToStorage();
      
      // Trigger fireworks on completion
      if (this.currentStepIndex === this.steps.length - 1 || this.currentStepIndex % 4 === 0) {
        this.fireworkManager?.startFireworks();
        setTimeout(() => this.fireworkManager?.stopFireworks(), 5000); // Show fireworks for 5 seconds
      }
      
      setTimeout(() => {
        this.show25PercentMessage = true;
        setTimeout(() => {
          this.show25PercentMessage = false;
        }, 3000);
      }, 1000);
    }

    // Set isScrollComplete to true if scrolled to 100% and current step is last
    this.isScrollComplete = scrollPercent >= 100 && this.currentStepIndex === this.steps.length - 1;
  }

  private updateCharacterPosition(): void {
    const characterElement = document.querySelector('.character') as HTMLElement;
    if (characterElement) {
      characterElement.classList.add('moving');
      setTimeout(() => characterElement.classList.remove('moving'), 2000);
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
    resetLocalStorage() {
      localStorage.removeItem('learningTrackerState');
      localStorage.removeItem('progressPageState'); // איפוס גם של מצב העמוד
      this.score = 0;
      this.level = 0;
      this.currentStepIndex = 0;
      this.characterTop = '0px';
      this.characterLeft = '0px';
      this.currentPage = 1;
      this.totalStepsCompleted = 0;
      this.updateCharacterPosition();
    }

    // פונקציות עבור מערכת דפים
    private syncWithProgressPage(): void {
      const pageState = localStorage.getItem('progressPageState');
      if (pageState) {
        try {
          const state = JSON.parse(pageState);
          this.currentPage = state.currentPage ?? 1;
        } catch {}
      }
    }

    onPageChange(): void {
      // כאשר עוברים לעמוד הבא, איפוס המצב הנוכחי של העמוד הזה
      this.currentStepIndex = 0;
      this.characterTop = '0px';
      this.characterLeft = '0px';
      this.updateCharacterPosition();
      this.saveStateToStorage();
    }

    getCurrentStepDisplay(): number {
      // מחזיר את המספר הגלובלי של השלב
      return this.totalStepsCompleted + this.currentStepIndex + 1;
    }

    getPageStepsRange(): string {
      const baseStep = (this.currentPage - 1) * 4;
      return `Steps ${baseStep + 1}-${baseStep + 4}`;
    }

    // Fireworks methods
    @HostListener('window:resize')
    onResize() {
      this.fireworkManager?.onResize();
    }

    
}
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { LineChart, ScatterChart } from 'echarts/charts';
import { GridComponent, VisualMapComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LearningTrackerComponent } from '../learning-tracker/learning-tracker.component';
import { ModalDirective } from '../../directives/modal.directive';

echarts.use([LineChart, ScatterChart, GridComponent, VisualMapComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective, LearningTrackerComponent, ModalDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
  numbers: number[] = [];
  margins: number[] = [];
  xPositions: number[] = [];
  circleColors: string[] = [];
  scrollProgress: number = 0; // ** קשור לנקודת ההתקדמות - אחוז ההתקדמות הכללי בגלילה **
  chartOptions1: EChartsOption = {}; // ** קשור לפיצול הגרף - אפשרויות הגרף הראשון (0-50%) **
  chartOptions2: EChartsOption = {}; // ** קשור לפיצול הגרף - אפשרויות הגרף השני (50%-100%) **
  
  // משתנים עבור ה-learning tracker modal
  showLearningTracker: boolean = false;
  lastQuarterShown: number = -1; // איזה רבע הוצג לאחרונה
  modalAutoCloseTimer: any;

  ngOnInit(): void {
    this.generateRandomNumbers();
    this.initializeChart();
  }

  ngOnDestroy(): void {
    // Clean up any event listeners if needed
    if (this.modalAutoCloseTimer) {
      clearTimeout(this.modalAutoCloseTimer);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.calculateScrollProgress();
    this.updateChart();
    this.checkLearningTrackerModal();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.calculateScrollProgress();
    this.updateChart();
  }

  private generateRandomNumbers(): void {
    this.numbers = [];
    this.margins = [];
    for (let i = 0; i < 20; i++) {
      const randomNum = Math.floor(Math.random() * 3) + 1;
      this.numbers.push(randomNum);
      const randomMargin = i > 0 ? (Math.floor(Math.random() * (35 - 10 + 1)) + 10) * 20 : 0;
      this.margins.push(randomMargin);
    }

    this.xPositions = [];
    let cumulative = 0;
    this.xPositions.push(cumulative);
    for (let i = 1; i < this.numbers.length; i++) {
      cumulative += this.margins[i];
      this.xPositions.push(cumulative);
    }

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#FFFFFF'];
    let shuffled = [...colors].sort(() => Math.random() - 0.5);
    this.circleColors = [];
    for (let i = 0; i < this.numbers.length; i++) {
      if (shuffled.length === 0) {
        shuffled = [...colors].sort(() => Math.random() - 0.5);
      }
      this.circleColors.push(shuffled.shift()!);
    }
  }

  private calculateScrollProgress(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollHeight > 0) {
      this.scrollProgress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
    } else {
      this.scrollProgress = 0;
    }

    this.scrollProgress = Math.round(this.scrollProgress * 10) / 10;
  }

  private initializeChart(): void {
    setTimeout(() => {
      this.updateChart();
    }, 100);
  }

  private updateChart(): void {
    const chartData = this.numbers;
    const progressRatio = this.scrollProgress / 100;
    const total = this.xPositions[this.xPositions.length - 1];
    const completedDistance = total * progressRatio;

    // ** קוד קשור לנקודת ההתקדמות - חישוב Y המתאים למיקום ההתקדמות על הקו **
    let progressY = 2; // ברירת מחדל
    for (let i = 0; i < this.xPositions.length - 1; i++) {
      const x1 = this.xPositions[i];
      const x2 = this.xPositions[i + 1];
      const y1 = chartData[i];
      const y2 = chartData[i + 1];
      
      if (completedDistance >= x1 && completedDistance <= x2) {
        // אינטרפולציה ליניארית בין שתי הנקודות
        const ratio = (completedDistance - x1) / (x2 - x1);
        progressY = y1 + (y2 - y1) * ratio;
        break;
      } else if (completedDistance <= x1) {
        progressY = y1;
        break;
      } else if (i === this.xPositions.length - 2 && completedDistance >= x2) {
        progressY = y2;
        break;
      }
    }

    const checkmarkSymbol = 'path://M10 18.5L3.5 12L1.5 14L10 22.5L22.5 10L20.5 8L10 18.5Z';

    // ** קוד קשור לפיצול הגרף לשניים - חלוקת הנתונים לשני חלקים **
    const midPoint = total / 2;
    
    // נתונים עבור הגרף הראשון (0-50%)
    const firstHalfData: any[] = [];
    
    // נתונים עבור הגרף השני (50%-100%)
    const secondHalfData: any[] = [];

    // ** קוד קשור לפיצול הגרף - איפוס מיקומים עבור הגרף השני **
    let firstHalfMax = 0;
    let secondHalfStart = Number.MAX_VALUE;

    // ** קוד קשור לפיצול הגרף - מציאת הנקודות הרלוונטיות לכל גרף **
    for (let i = 0; i < this.xPositions.length; i++) {
      const x = this.xPositions[i];
      
      if (x <= midPoint) {
        firstHalfMax = Math.max(firstHalfMax, x);
      } else {
        secondHalfStart = Math.min(secondHalfStart, x);
        break;
      }
    }

    // ** קוד קשור לפיצול הגרף - חלוקת הנתונים **
    for (let i = 0; i < this.xPositions.length; i++) {
      const x = this.xPositions[i];
      const isCompleted = x <= completedDistance;
      
      const dataPoint = {
        value: [x, chartData[i]],
        symbol: isCompleted ? checkmarkSymbol : 'circle',
        symbolSize: isCompleted ? 18 : 10,
        itemStyle: isCompleted ? {
          color: '#B9E757',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 3
        } : {
          color: this.circleColors[i],
          borderWidth: 1,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 3
        }
      };

      if (x <= midPoint) {
        firstHalfData.push(dataPoint);
      } else {
        // ** קוד קשור לפיצול הגרף - כאן אנחנו משנים את המיקום X עבור הגרף השני **
        secondHalfData.push({
          ...dataPoint,
          value: [x - secondHalfStart, chartData[i]]
        });
      }
    }

    // ** קוד קשור לפיצול הגרף ולנקודת ההתקדמות - יצירת הגרף הראשון (0-50%) **
    // עיגול ההתקדמות יופיע רק אם ההתקדמות מתחת ל-50%
    this.chartOptions1 = this.createChartOptions(
      firstHalfData, 
      firstHalfMax, 
      Math.min(completedDistance, firstHalfMax),
      progressY,
      checkmarkSymbol,
      0,
      midPoint,
      this.scrollProgress < 50 // הוספת פרמטר שמציין האם להציג עיגול התקדמות
    );

    // ** קוד קשור לפיצול הגרף ולנקודת ההתקדמות - יצירת הגרף השני (50%-100%) **
    const secondHalfCompletedDistance = Math.max(0, completedDistance - secondHalfStart);
    const secondHalfWidth = total - secondHalfStart;
    
    // עיגול ההתקדמות יופיע רק אם ההתקדמות מעל 50%
    this.chartOptions2 = this.createChartOptions(
      secondHalfData, 
      secondHalfWidth, 
      secondHalfCompletedDistance,
      progressY,
      checkmarkSymbol,
      secondHalfStart,
      total,
      this.scrollProgress >= 50 // הוספת פרמטר שמציין האם להציג עיגול התקדמות
    );
  }

  private createChartOptions(
    chartDataWithPos: any[],
    chartWidth: number,
    completedDistance: number,
    progressY: number,
    checkmarkSymbol: string,
    originalStart: number,
    originalEnd: number,
    showProgressCircle: boolean = true // ** פרמטר קשור לנקודת ההתקדמות - קובע האם להציג עיגול התקדמות **
  ): EChartsOption {
    const progressRatio = this.scrollProgress / 100;
    const totalOriginal = this.xPositions[this.xPositions.length - 1];
    
    // ** קוד קשור לפיצול הגרף - חישוב יחס ההתקדמות עבור הגרף הנוכחי **
    let localProgressRatio = 0;
    if (originalStart === 0) {
      // גרף ראשון (0-50%)
      localProgressRatio = Math.min(1, progressRatio * 2);
    } else {
      // גרף שני (50%-100%)
      localProgressRatio = Math.max(0, (progressRatio - 0.5) * 2);
    }

    return {
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        position: function (point: any, params: any, dom: any, rect: any, size: any) {
          if (rect && size) {
            const centerX = rect.x + (rect.width / 2) - (size.contentSize[0] / 2);
            const aboveY = rect.y - size.contentSize[1] + 10;
            return [centerX, aboveY];
          }
          return [0, 0];
        },
        formatter: (params: any) => {
          const pointNumber = params.value[1];
          const totalPoints = pointNumber * 15;
          const totalOriginal = this.xPositions[this.xPositions.length - 1];
          const xPosition = params.value[0] + originalStart;
          const progressRatio = this.scrollProgress / 100;
          const isCompleted = xPosition <= (totalOriginal * progressRatio);
          const emoji = isCompleted ? '👏' : '📚';

          let difficultyText = '';
          switch (pointNumber) {
            case 1:
              difficultyText = 'קטע קל';
              break;
            case 2:
              difficultyText = 'קטע מאתגר';
              break;
            case 3:
              difficultyText = 'קטע קשה';
              break;
            default:
              difficultyText = `קטע ${pointNumber}`;
          }

          return `
            <div style="
                background-color: #f7fff5;
                border: 2px solid #b9e757;
                border-radius: 8px;
                padding: 10px 15px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-weight: bold;
                    color: #20A57D;
                    font-size: 16px;
                ">
                    <span style="font-size: 20px;">${emoji}</span>
                    <span style="direction: rtl">${difficultyText} ${totalPoints} נק' </span>
                </div>
            </div>
          `;
        },
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        shadowColor: 'transparent',
        extraCssText: 'box-shadow: none; z-index: 9999;'
      },
      grid: {
        left: 0,
        right: 0,
        containLabel: false,
        backgroundColor: {
          type: 'linear',
          x: 1,
          y: 0,
          x2: 0,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#20A57D' },
            { offset: localProgressRatio, color: '#20A57D' },
            { offset: localProgressRatio, color: '#EAEAEA' },
            { offset: 1, color: '#EAEAEA' }
          ]
        },
        show: true
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: chartWidth,
        show: false,
        inverse: true
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 4,
        show: false
      },
      series: [
        {
          data: chartDataWithPos,
          type: 'line' as const,
          smooth: true,
          areaStyle: {
            color: '#ffffff',
            opacity: 0.32
          },
          lineStyle: {
            color: '#ffffff',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            borderWidth: 1,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 3
          },
          symbol: 'circle',
          symbolSize: 10,
          animation: true
        },
        // ** קוד קשור לנקודת ההתקדמות - עיגול לבן שמייצג את ההתקדמות הנוכחית **
        // רק אם ההתקדמות בטווח הגרף הנוכחי ורק בגרף הרלוונטי (מתחת ל-50% ימני, מעל 50% שמאלי)
        ...(showProgressCircle && completedDistance >= 0 && completedDistance <= chartWidth ? [{
          data: [{
            value: [completedDistance, progressY],
            symbol: 'circle',
            symbolSize: 20,
            itemStyle: {
              color: '#f01313ff',
              borderColor: '#20A57D',
              borderWidth: 3,
              shadowColor: 'rgba(0, 0, 0, 0.4)',
              shadowBlur: 6
            }
          }],
          type: 'scatter' as const,
          symbolKeepAspect: true,
          silent: true
        }] : [])
      ],
      animation: false
    };
  }

  // פונקציות עבור ה-learning tracker modal
  checkLearningTrackerModal(): void {
    // חישוב איזה רבע של הדף אנחנו נמצאים בו (0, 1, 2, 3)
    const currentQuarter = Math.floor(this.scrollProgress / 25);
    
    // אם עברנו רבע חדש ועדיין לא הצגנו אותו
    if (currentQuarter > this.lastQuarterShown && currentQuarter > 0) {
      this.showLearningTrackerModal();
      this.lastQuarterShown = currentQuarter;
    }
  }

  showLearningTrackerModal(): void {
    this.showLearningTracker = true;
    
    // סגירה אוטומטית לאחר 5 שניות
    this.modalAutoCloseTimer = setTimeout(() => {
      this.closeLearningTrackerModal();
    }, 100000);
  }

  closeLearningTrackerModal(): void {
    this.showLearningTracker = false;
    if (this.modalAutoCloseTimer) {
      clearTimeout(this.modalAutoCloseTimer);
      this.modalAutoCloseTimer = null;
    }
  }

  onModalClickOutside(): void {
    this.closeLearningTrackerModal();
  }
}
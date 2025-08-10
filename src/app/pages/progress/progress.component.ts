import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, VisualMapComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, VisualMapComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
  numbers: number[] = [];
  margins: number[] = [];
  xPositions: number[] = [];
  circleColors: string[] = [];
  scrollProgress: number = 0;
  chartOptions: EChartsOption = {};

  ngOnInit(): void {
    this.generateRandomNumbers();
    this.initializeChart();
  }

  ngOnDestroy(): void {
    // Clean up any event listeners if needed
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.calculateScrollProgress();
    this.updateChart();
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

    // חישוב מיקומים מצטברים עבור ציר X בגרף
    this.xPositions = [];
    let cumulative = 0;
    this.xPositions.push(cumulative);
    for (let i = 1; i < this.numbers.length; i++) {
      cumulative += this.margins[i];
      this.xPositions.push(cumulative);
    }

    // יצירת צבעים רנדומאליים לעיגולים: shuffle הרשימה, השתמש עד נגמר, shuffle מחדש
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

    const checkmarkSymbol = 'path://M10 18.5L3.5 12L1.5 14L10 22.5L22.5 10L20.5 8L10 18.5Z';

    const chartDataWithPos = this.xPositions.map((x, index) => ({
      value: [x, chartData[index]],
      symbol: x <= completedDistance ? checkmarkSymbol : 'circle',
      symbolSize: x <= completedDistance ? 18 : 10,
      itemStyle: x <= completedDistance ? {
        color: '#B9E757',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 3
      } : {
        color: this.circleColors[index],
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 3
      }
    }));

    this.chartOptions = {
         tooltip: {
  trigger: 'item',
  appendToBody: true,
  position: function (point, params, dom, rect, size) {
    if (rect && size) {
      const centerX = rect.x + (rect.width / 2) - (size.contentSize[0] / 2);
      const aboveY = rect.y - size.contentSize[1] +10;
      
      return [centerX, aboveY];
    }
    return [0, 0];
  },
 formatter: (params: any) => {
    const pointNumber = params.value[1];
    const totalPoints = pointNumber * 15;
    const xPosition = params.value[0];
    const isCompleted = xPosition <= completedDistance;
    const emoji = isCompleted ? '👏' : '📚';
    
    // קביעת רמת הקושי לפי המספר
    let difficultyText = '';
    switch(pointNumber) {
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
      // שאר הגדרות הגרף נשארות כפי שהן
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
            { offset: progressRatio, color: '#20A57D' },
            { offset: progressRatio, color: '#EAEAEA' },
            { offset: 1, color: '#EAEAEA' }
          ]
        },
        show: true
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: total,
        show: false,
        inverse: true
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 4,
        show: false
      },
      visualMap: {
        show: false,
        type: 'piecewise',
        dimension: 0,
        pieces: this.xPositions.map((x, index) => ({
          min: x - 0.1,
          max: x + 0.1,
          color: x <= completedDistance ? '#20A57D' : this.circleColors[index]
        }))
      },
      series: [
        {
          data: chartDataWithPos,
          type: 'line',
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
          // emphasis: {
          //   focus: 'self',
          //   itemStyle: {
          //     shadowBlur: 2,
          //     shadowColor: 'rgba(0, 0, 0, 0.5)',
          //     borderWidth: 3
          //   }
          // },
          symbol: 'circle',
          symbolSize: 10,
          animation: true
        }
      ],
      animation: false
    };
  }
}
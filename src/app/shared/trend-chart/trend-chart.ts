import { Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import Chart from 'chart.js/auto';

export interface TrendPoint {
  label: string;
  created: number;
  completed: number;
}

function resolveColor(colorStr: string): string {
  if (!colorStr) return '#0e7c7b';
  if (colorStr.startsWith('var(')) {
    const varName = colorStr.replace(/^var\((--[^)]+)\)/, '$1').trim();
    const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (computed) return computed;
    const fallbackMap: Record<string, string> = {
      '--success': '#299d6f',
      '--accent': '#ff6f4d',
      '--warning': '#d99a1f',
      '--danger': '#e0524f',
      '--primary': '#0e7c7b',
      '--text': '#0f2622',
      '--text-muted': '#5c766f',
      '--border': '#d7e6e2'
    };
    return fallbackMap[varName] || '#0e7c7b';
  }
  return colorStr;
}

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 220px;
    }
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
  `]
})
export class TrendChart implements OnDestroy {
  readonly points = input.required<TrendPoint[]>();

  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart?: Chart;

  constructor() {
    effect(() => {
      const points = this.points();
      const canvas = this.canvasRef()?.nativeElement;
      if (!canvas) return;

      this.updateChart(canvas, points);
    });
  }

  private updateChart(canvas: HTMLCanvasElement, points: TrendPoint[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const textColor = resolveColor('var(--text)');
    const mutedColor = resolveColor('var(--text-muted)');
    const gridColor = resolveColor('var(--border)');
    const accentColor = resolveColor('var(--accent)');
    const successColor = resolveColor('var(--success)');

    const labels = points.map((p) => p.label);
    const createdData = points.map((p) => p.created);
    const completedData = points.map((p) => p.completed);

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Created',
            data: createdData,
            borderColor: accentColor,
            backgroundColor: 'rgba(255, 111, 77, 0.18)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Completed',
            data: completedData,
            borderColor: successColor,
            backgroundColor: 'rgba(41, 157, 111, 0.18)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              color: textColor,
              font: { family: 'Manrope', size: 12, weight: 600 }
            }
          },
          tooltip: { enabled: true, padding: 10, cornerRadius: 8 }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: mutedColor, font: { family: 'Manrope', size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: mutedColor, precision: 0, font: { family: 'Manrope', size: 11 } }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

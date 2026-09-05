import { Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import Chart from 'chart.js/auto';

export interface BarDatum {
  label: string;
  value: number;
  color: string;
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
      '--text-muted': '#5c766f',
      '--border': '#d7e6e2'
    };
    return fallbackMap[varName] || '#0e7c7b';
  }
  return colorStr;
}

@Component({
  selector: 'app-bar-chart',
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
export class BarChart implements OnDestroy {
  readonly data = input.required<BarDatum[]>();

  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart?: Chart;

  constructor() {
    effect(() => {
      const items = this.data();
      const canvas = this.canvasRef()?.nativeElement;
      if (!canvas) return;

      this.updateChart(canvas, items);
    });
  }

  private updateChart(canvas: HTMLCanvasElement, items: BarDatum[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const textColor = resolveColor('var(--text-muted)');
    const gridColor = resolveColor('var(--border)');
    const labels = items.map((i) => i.label);
    const values = items.map((i) => i.value);
    const bgColors = items.map((i) => resolveColor(i.color));

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: bgColors,
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true, padding: 8, cornerRadius: 6 }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Manrope', size: 12, weight: 600 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: textColor, precision: 0, font: { family: 'Manrope', size: 11 } }
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

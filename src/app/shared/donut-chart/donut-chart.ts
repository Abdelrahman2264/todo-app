import { Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import Chart from 'chart.js/auto';

export interface DonutSlice {
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
      '--text': '#0f2622',
      '--surface': '#ffffff'
    };
    return fallbackMap[varName] || '#0e7c7b';
  }
  return colorStr;
}

@Component({
  selector: 'app-donut-chart',
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
      display: flex;
      align-items: center;
      justify-content: center;
    }
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
  `]
})
export class DonutChart implements OnDestroy {
  readonly slices = input.required<DonutSlice[]>();
  readonly centerLabel = input<string>('');
  readonly centerValue = input<string>('');

  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart?: Chart;

  constructor() {
    effect(() => {
      const slices = this.slices();
      const canvas = this.canvasRef()?.nativeElement;
      if (!canvas) return;

      this.updateChart(canvas, slices);
    });
  }

  private updateChart(canvas: HTMLCanvasElement, slices: DonutSlice[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const textColor = resolveColor('var(--text)');
    const labels = slices.map((s) => s.label);
    const data = slices.map((s) => s.value);
    const bgColors = slices.map((s) => resolveColor(s.color));

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: bgColors,
            borderWidth: 2,
            borderColor: resolveColor('var(--surface)'),
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              color: textColor,
              font: { family: 'Manrope', size: 12, weight: 600 }
            }
          },
          tooltip: {
            enabled: true,
            padding: 10,
            cornerRadius: 8
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

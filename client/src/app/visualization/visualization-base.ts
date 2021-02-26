import { Input } from '@angular/core';
import * as d3 from 'd3';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Decimal } from 'decimal.js';

export abstract class VisualizationBase {
    svg: any;
    margin = 50;
    width = 750;
    height = 400;
    svgReady = new ReplaySubject<void>();
    data: Array<any>;
    dataXKey: string;
    dataYKey: string;
    yMin: number;
    yMax: number;
    xMin: number;
    xMax: number;
    @Input() title = 'Graph';
    legendItems: Array<{ color: string; label: string }> = [];
    xAxis: any;
    yAxis: any;

    createSvg(
        element: HTMLElement,
        width = this.width,
        height = this.height,
        marginLeft = this.margin,
        marginBottom = this.margin,
        marginRight = 0,
        marginTop = 0,
    ): void {
        this.svg = d3.select(element)
            .append('svg')
            .attr('width', width + marginLeft + marginRight)
            .attr('height', height + marginBottom + marginTop)
            .append('g').attr('transform', `translate(${marginLeft},${marginTop})`);
        this.svgReady.next();
        this.svgReady.complete();
    }

    @Input('width')
    set widthInput(width: number) {
        if (width != null) {
            this.width = width;
            this.svgReady.pipe(take(1)).subscribe(() => {
                this.svg.attr('width', this.width + (this.margin * 2));
            });
            // this.setSvgAttributes();
        }
    }

    @Input('height')
    set heightInput(height: number) {
        if (height != null) {
            this.height = height;
            this.svgReady.pipe(take(1)).subscribe(() => {
                this.svg.attr('height', this.height + (this.margin * 2));
            });
            // this.setSvgAttributes();
        }
    }

    @Input('data')
    set dataInput(data: any) {
        if (data != null) {
            this.data = data;
            this.processData();
            this.svgReady.pipe(take(1)).subscribe(() => {
                this.drawChart();
            });
        }
    }

    @Input('xKey')
    set dataXKeyInput(xKey: string) {
        if (xKey != null) {
            this.dataXKey = xKey;
            this.processData();
            this.svgReady.pipe(take(1)).subscribe(() => {
                this.drawChart();
            });
        }
    }

    @Input('yKey')
    set dataYKeyInput(yKey: string) {
        if (yKey != null) {
            this.dataYKey = yKey;
            this.processData();
            this.svgReady.pipe(take(1)).subscribe(() => {
                this.drawChart();
            });
        }
    }

    @Input('xLabel')
    set xLabelInput(xLabel: string) {
        if (xLabel != null) {
            this.svgReady.pipe(take(1)).subscribe(() => {
                this.svg.append('text')
                    .attr('class', 'x label')
                    .attr('text-anchor', 'middle')
                    .attr('x', this.width / 2)
                    .attr('y', this.height + 35)
                    .text(xLabel);
            });
        }
    }

    @Input('yLabel')
    set yLabelInput(yLabel: string) {
        if (yLabel != null) {
            this.svgReady.pipe(take(1)).subscribe(() => {
                this.svg.append('text')
                    .attr('class', 'y label')
                    .attr('text-anchor', 'middle')
                    .attr('y', -40)
                    .attr('x', this.height / -2)
                    .attr('transform', 'rotate(-90)')
                    .text(yLabel);
            });
        }
    }

    processData(): void {
        this.setMinMax();
    }

    setMinMax(): void {
        if (this.data != null && this.dataXKey != null && this.dataYKey != null) {
            const xVector: Array<number> = [];
            const yVector: Array<number> = [];

            this.data.forEach(item => {
                if (typeof item[this.dataXKey] === 'number') {
                    xVector.push(item[this.dataXKey]);
                }
                if (typeof item[this.dataYKey] === 'number') {
                    yVector.push(item[this.dataYKey]);
                }
            });

            if (xVector.length > 0) {
                const xMax = Decimal.max(...xVector);
                const xMin = Decimal.min(...xVector);
                const xRange = xMax.minus(xMin);
                const xPadding = xRange.times(.1);
                this.xMax = xMax.plus(xPadding).toNumber();
                this.xMin = xMin.minus(xPadding).toNumber();
            }

            if (yVector.length > 0) {
                const yMax = Decimal.max(...yVector);
                const yMin = Decimal.min(...yVector);
                const yRange = yMax.minus(yMin);
                const yPadding = yRange.times(.1);
                this.yMax = yMax.plus(yPadding).toNumber();
                this.yMin = yMin.minus(yPadding).toNumber();
            }
        }
    }

    drawChart() {}
}

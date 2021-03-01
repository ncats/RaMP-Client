import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { VisualizationBase } from '../visualization-base';
import * as d3 from 'd3';
import { take } from 'rxjs/operators';
import { ProcessedData } from './processed-data';
import { Colors } from '../colors.constant';
import { Decimal } from 'decimal.js';
import { TooltipService } from '../tooltip/tooltip.service';

@Component({
  selector: 'ramp-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent extends VisualizationBase implements OnInit, AfterViewInit {
  @ViewChild('barChartBox', { read: ElementRef, static: false }) barChartElement: ElementRef;
  calculation: 'average'|'sum';
  processedData: Array<ProcessedData>;
  @Output() barClicked = new EventEmitter();

  constructor(
    private tooltipService: TooltipService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.createSvg(this.barChartElement.nativeElement);
    this.drawChart();
  }

  @Input('calculation')
  set calculationInput(calculation: 'average'|'sum') {
    if (calculation != null) {
      this.calculation = calculation;
      this.processData();
      this.svgReady.pipe(take(1)).subscribe(() => {
        this.drawChart();
      });
    }
  }

  processData(): void {
    super.processData();
    this.processedData = [];
    if (this.data != null && this.calculation != null && this.dataXKey != null && this.dataYKey != null) {
      const processedDataDict = {};
      this.data.forEach(item => {

        if (processedDataDict[item[this.dataXKey]] == null) {
          processedDataDict[item[this.dataXKey]] = {
            sum: 0,
            numItems: 0,
            xValue: item[this.dataXKey]
          };
        }

        processedDataDict[item[this.dataXKey]].sum =
          Decimal.add(item[this.dataYKey], processedDataDict[item[this.dataXKey]].sum).toNumber();
        processedDataDict[item[this.dataXKey]].numItems++;
      });

      let colorIndex = 0;
      Object.keys(processedDataDict).forEach(key => {
        const processedDataItem: ProcessedData = {
          color: Colors[colorIndex],
          xValue: key,
          yValue: this.calculation === 'average' ?
            Decimal.div(processedDataDict[key].sum, processedDataDict[key].numItems).toNumber() :
            processedDataDict[key].sum
        };
        this.processedData.push(processedDataItem);
        colorIndex++;
      });
    }
  }

  drawChart(): void {

    if (this.svg != null && this.data != null && this.dataXKey != null && this.dataYKey != null) {
      super.drawChart();

      // Add X axis
      this.xAxis = d3.scaleBand()
        .domain(this.processedData.map(d => d.xValue))
        .range([0, this.width])
        .padding(0.2);

      this.svg.append('g')
        .attr('transform', `translate(0,${this.height})`)
        .call(d3.axisBottom(this.xAxis));

      // Add Y axis
      this.yAxis = d3.scaleLinear()
        .domain([this.yMin, this.yMax])
        .range([this.height, 0]);

      this.svg.append('g')
        .call(d3.axisLeft(this.yAxis));

      // Add bar
      this.svg.selectAll('bars')
        .data(this.processedData)
        .enter()
        .append('rect')
        .attr('class', 'clickable')
        .attr('x', d => this.xAxis(d.xValue))
        .attr('y', d => this.yAxis(d.yValue))
        .attr('width', this.xAxis.bandwidth())
        .attr('height', (d) => this.height - this.yAxis(d.yValue))
        .attr('fill', Colors[0])
        .on('mouseover', (d, i) => {
          this.tooltipService.showTooltip(d, i.yValue);
        })
        .on('mouseout', (d, i) => {
          this.tooltipService.hideTooltip();
        })
        .on('click', (d, i) => { this.barClicked.emit(i); });
    }
  }

}

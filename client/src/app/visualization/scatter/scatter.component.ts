import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { VisualizationBase } from '../visualization-base';
import { Colors } from '../colors.constant';
import { take } from 'rxjs/operators';
import * as d3 from 'd3';
import { TooltipService } from '../tooltip/tooltip.service';

@Component({
  selector: 'ramp-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent extends VisualizationBase implements OnInit, AfterViewInit {
  @ViewChild('scatterPlotBox', { read: ElementRef, static: false }) scatterPlotElement: ElementRef;
  private clustersKey: string;
  private clusters: { [cluster: string]: { color: string, data: Array<any> } } = {};
  @Input() tooltipKey: string;

  constructor(
    private tooltipService: TooltipService
  ) {
    super();
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.createSvg(this.scatterPlotElement.nativeElement);
    this.drawChart();
  }

  @Input('clustersKey')
  set dataClustersKeyInput(clustersKey: string) {
    if (clustersKey != null) {
      this.clustersKey = clustersKey;
      this.processData();
      this.svgReady.pipe(take(1)).subscribe(() => {
        this.drawChart();
      });
    }
  }

  processData(): void {
    super.processData();
    this.clusterData();
  }

  private clusterData(): void {
    if (this.data != null && this.clustersKey != null) {
      let colorIndex = 0;
      this.data.forEach(item => {
        if (this.clusters[item[this.clustersKey.toString()]] == null) {
          this.clusters[item[this.clustersKey.toString()]] = {
            color: Colors[colorIndex],
            data: []
          };
          this.legendItems.push({
            color: Colors[colorIndex],
            label: item[this.clustersKey.toString()]
          });
          colorIndex++;
        }
        this.clusters[item[this.clustersKey.toString()]].data.push(item);
      });
      this.legendItems = this.legendItems.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (b.label < a.label) {
          return 1;
        }
        return 0;
      });
    }
  }

  drawChart(): void {

    if (this.svg != null && this.data != null && this.dataXKey != null && this.dataYKey != null) {
      super.drawChart();

      // Add X axis
      this.xAxis = d3.scaleLinear()
        .domain([this.xMin, this.xMax])
        .range([0, this.width]);

      this.svg.append('g')
        .attr('transform', `translate(0,${this.height})`)
        .call(d3.axisBottom(this.xAxis));

      // Add Y axis
      this.yAxis = d3.scaleLinear()
        .domain([this.yMin, this.yMax])
        .range([this.height, 0]);

      this.svg.append('g')
        .call(d3.axisLeft(this.yAxis));

      // Add dots
      const dots = this.svg.append('g');

      if (this.clustersKey == null || this.clustersKey === '') {
        dots.selectAll('dot')
          .data(this.data)
          .enter()
          .append('circle')
          .attr('cx', d => this.xAxis(d[this.dataXKey]))
          .attr('cy', d => this.yAxis(d[this.dataYKey]))
          .attr('r', 5)
          .style('opacity', .8)
          .style('fill', Colors[0])
          .on('mouseover', (d, i) => {
            console.log(i);
            this.tooltipService.showTooltip(d, [i[this.tooltipKey]]);
          })
          .on('mouseout', (d, i) => {
            this.tooltipService.hideTooltip();
          });
      } else {
        Object.keys(this.clusters).forEach(cluster => {
          dots.selectAll('dot')
            .data(this.clusters[cluster].data)
            .enter()
            .append('circle')
            .attr('cx', d => this.xAxis(d[this.dataXKey]))
            .attr('cy', d => this.yAxis(d[this.dataYKey]))
            .attr('r', 3)
            .style('opacity', .8)
            .style('fill', this.clusters[cluster].color)
            .on('mouseover', (d, i) => {
              console.log(i);
              this.tooltipService.showTooltip(d, [`Pathway: ${i[this.tooltipKey]}`, `Cluster: ${i[this.clustersKey]}`]);
            })
            .on('mouseout', (d, i) => {
              this.tooltipService.hideTooltip();
            });
        });
      }
    }
  }
}

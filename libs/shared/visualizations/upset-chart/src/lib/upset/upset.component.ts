import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { select } from 'd3-selection';
import { axisLeft, AxisScale } from 'd3-axis';
import {
  scaleBand,
  ScaleBand,
  scaleLinear,
  ScaleLinear,
  scaleLog,
} from 'd3-scale';
import { format } from 'd3-format';
import { extent, max } from 'd3-array';
import { UpsetData } from '../upset-data';

@Component({
  selector: 'ramp-upset',
  templateUrl: './upset.component.html',
  styleUrls: ['./upset.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UpsetComponent implements OnInit {
  @Input() scale: 'linear' | 'log' = 'linear';
  @Output() upSetBarClicked = new EventEmitter();
  @Input() title!: string;
  @ViewChild('upsetPlotBox', { static: true }) upsetPlotElement!: ElementRef;

  svg: any;
  width: number = 300;
  height: number = 300;
  margin = { top: 5, bottom: 5, left: 5, right: 5 };
  allSetIds: string[] = [];
  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<any> = new Subject();

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   * @type {BehaviorSubject<any>}
   * @private
   */
  protected _data = new BehaviorSubject<any>(null);

  /**
   * pushes changed data to {BehaviorSubject}
   * @param value
   */
  @Input()
  set data(value: any[]) {
    this._data.next(value.map((val) => new UpsetData(val)));
  }

  /**
   * returns value of {BehaviorSubject}
   * @returns UpsetData[]
   */
  get data(): UpsetData[] {
    return this._data.getValue();
  }

  /**
   * function to redraw/scale the graph on window resize
   */
  @HostListener('window:resize', [])
  onResize() {
    this.redrawChart();
  }

  constructor(@Inject(PLATFORM_ID) private platformID: any) {}

  ngOnInit(): void {
    this._data
      // listen to data as long as term is undefined or null
      // Unsubscribe once term has value
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((data: UpsetData[]) => {
          data.forEach((d) => this.allSetIds.push(...d.sets));
          this.allSetIds = [...new Set(this.allSetIds)];
          // Process data: check set membership for each combination
          data.forEach((combination) => {
            this.allSetIds.forEach((d) => {
              combination.combinations?.push({
                setId: d,
                member: combination.sets.includes(d),
              });
            });

            // Determine which sets (circles in the combination matrix) should be connected with a line
            if (combination.sets.length > 1) {
              combination.connectorIndices = extent(combination.sets, (d) =>
                this.allSetIds.indexOf(d)
              );
            } else {
              combination.connectorIndices = [0, 0];
            }
          });
          this.allSetIds = [...new Set(this.allSetIds)];
          return data;
        })
      )
      .subscribe((data) => {
        if (isPlatformBrowser(this.platformID)) {
          if (data.length > 0) {
            this.drawContainer();
          }
        }
      });
  }

  redrawChart(): void {
    select(this.upsetPlotElement.nativeElement).selectAll('*').remove();
    this.drawContainer();
  }

  drawContainer(): void {
    const element = this.upsetPlotElement.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    const innerMargin = 10;
    const tooltipMargin = 10;

    // const width = this.width - margin.left - margin.right;
    //  const height = this.height - margin.top - margin.left;

    const leftColWidth = this.width * 0.25;
    const rightColWidth = this.width - leftColWidth;

    const topRowHeight = this.height * 0.66;
    const bottomRowHeight = this.height - topRowHeight - innerMargin;

    // Initialize scales
    const xScale: ScaleBand<string> = scaleBand()
      .domain(this.data.map((d) => d.id))
      .range([0, rightColWidth])
      .paddingInner(0.2);

    const yCombinationScale: ScaleBand<string> = scaleBand()
      .domain(this.allSetIds)
      .range([0, bottomRowHeight])
      .paddingInner(0.2);

    let yAxis;
    let intersectionSizeScale:
      | AxisScale<number>
      | (number[] & ScaleLinear<number, number>);

    if (this.scale === 'log') {
      intersectionSizeScale = scaleLog()
        .domain([1, this._getMax()])
        .range([topRowHeight, 0]);

      yAxis = axisLeft(intersectionSizeScale)
        .scale(intersectionSizeScale)
        .tickFormat((d, i) => {
          return (i % 5 === 0 && format(',d')(Number(d))) || '';
        })
        .tickSize(5);
    } else {
      intersectionSizeScale = scaleLinear()
        .domain([1, this._getMax()])
        .range([topRowHeight, 0]);

      yAxis = axisLeft(intersectionSizeScale).tickSize(5);
    }

    // Prepare the overall layout
    const svg = select(element)
      .append('svg:svg')
      .attr('width', this.width)
      .attr('height', this.height);
    /* .append("svg:g")
     .attr("transform", `translate(0, ${this.margin.top})`);
*/
    const setSizeChart = svg
      .append('svg:g')
      .attr('transform', `translate(0, ${topRowHeight + innerMargin})`);

    const intersectionSizeChart = svg
      .append('svg:g')
      .attr('class', 'intersection-size')
      .attr('transform', `translate(${leftColWidth}, 0)`);

    const combinationMatrix = svg
      .append('svg:g')
      .attr(
        'transform',
        `translate(${leftColWidth}, ${topRowHeight + innerMargin})`
      );

    /*
     * Combination matrix
     */

    // Create a group for each combination
    const combinationGroup = combinationMatrix
      .selectAll('.combination')
      .data(this.data)
      .join('svg:g')
      .attr('class', 'combination')
      .attr(
        'transform',
        // @ts-ignore
        //todo: fix the ts-ignore
        (d) => `translate(${xScale(d.id) + xScale.bandwidth() / 2}, 0)`
      );

    // Select all circles within each group and bind the inner array per data item
    const circle = combinationGroup
      .selectAll('circle')
      .data((combination) => combination.combinations)
      .join('circle')
      .classed('member', (d) => d.member)

      .attr(
        'cy',
        // @ts-ignore
        //todo: fix the ts-ignore
        (d) => yCombinationScale(d.setId) + yCombinationScale.bandwidth() / 2
      )
      .attr('r', (d) => yCombinationScale.bandwidth() / 4);

    // Connect the sets with a vertical line
    const connector = combinationGroup
      .filter((d) => d.connectorIndices.length > 0)
      .append('svg:line')
      .style('fill', '#265668')
      .attr('class', 'connector')
      .attr(
        'y1',
        (d) =>
          // @ts-ignore
          //todo: fix the ts-ignore
          yCombinationScale(this.allSetIds[d.connectorIndices[0]]) +
          yCombinationScale.bandwidth() / 2
      )
      .attr(
        'y2',
        (d) =>
          // @ts-ignore
          //todo: fix the ts-ignore
          yCombinationScale(this.allSetIds[d.connectorIndices[1]]) +
          yCombinationScale.bandwidth() / 2
      );

    /*
     * Set size chart
     */
    svg
      .append('svg:g')
      .attr('transform', (d) => `translate(0, ${topRowHeight})`);

    setSizeChart
      .selectAll('.set-name')
      .data(this.allSetIds)
      .join('text')
      .attr('class', 'set-name')
      .attr('text-anchor', 'end')
      .attr('font-size', '.8em')
      .attr('x', leftColWidth - this.margin.left)
      .attr(
        'y',
        // @ts-ignore
        //todo: fix the ts-ignore
        (d) => yCombinationScale(d) + yCombinationScale.bandwidth() / 2
      )
      .attr('dy', '0.35em')
      .text((d) => d);

    /*
     * Intersection size chart
     */

    // const intersectionSizeAxis = d3.axisLeft(intersectionSizeScale).ticks(3);

    //todo: this ignores the previous Yaxis assignment
    const intersectionSizeAxis = axisLeft(intersectionSizeScale)
      .scale(intersectionSizeScale)
      .tickFormat((d, i) => {
        return (i % 5 === 0 && format(',d')(Number(d))) || '';
      })
      .tickSize(5);

    intersectionSizeChart
      .append('g')
      .attr(
        'transform',
        (d) =>
          `translate(${-(this.margin.left + this.margin.right)}, ${
            this.margin.top + this.margin.bottom
          })`
      )
      .call(intersectionSizeAxis);

    intersectionSizeChart
      .append('g')
      .attr(
        'transform',
        (d) => `translate(0, ${this.margin.top + this.margin.bottom})`
      )
      .selectAll('rect')
      .data(this.data)
      .join('rect')
      .attr('class', 'bar')
      .style('fill', '#265668')
      // @ts-ignore
      //todo: fix the ts-ignore
      .attr('height', (d) => topRowHeight - intersectionSizeScale(d.size))
      .attr('width', xScale.bandwidth())
      // @ts-ignore
      //todo: fix the ts-ignore
      .attr('x', (d) => xScale(d.id))
      // @ts-ignore
      //todo: fix the ts-ignore
      .attr('y', (d) => intersectionSizeScale(d.size))
      .on('mouseover', (event, d) => {
        //  d3.select("#tooltip").style("opacity", 1).html(d.values.join("<br/>"));
      })
      .on('mousemove', (event) => {
        select('#tooltip')
          .style('left', event.pageX + tooltipMargin + 'px')
          .style('top', event.pageY + tooltipMargin + 'px');
      })
      .on('mouseout', () => {
        select('#tooltip').style('opacity', 0);
      });
    intersectionSizeChart
      .append('svg:g')
      .attr('transform', (d) => `translate(0, ${this.margin.top - 1})`)
      .attr('class', 'bar-labels')
      .selectAll('.text')
      .data(this.data)
      .enter()
      .append('text')
      .attr('font-size', '.6em')
      // @ts-ignore
      //todo: fix the ts-ignore
      .attr('x', (d) => xScale(d.id))
      // @ts-ignore
      //todo: fix the ts-ignore
      .attr('y', (d) =>
        d.size > 0
          ? // @ts-ignore
            //todo: fix the ts-ignore
            intersectionSizeScale(d.size) + this.margin.top
          : // @ts-ignore
            //todo: fix the ts-ignore
            intersectionSizeScale(1) + this.margin.top
      )
      .text((d: { size: number }) => format(',d')(Number(d.size)));
  }

  private _getMax(): number {
    let maxN: number | undefined = max(this.data, (d) => d.size);
    if (!maxN) {
      maxN = 0;
    }
    return maxN;
  }
}

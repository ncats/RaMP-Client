import {
  Component, DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener, inject,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
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
  standalone: true,
})
export class UpsetComponent implements OnInit {
  @Input() scale: 'linear' | 'log' = 'linear';
  @Output() upSetBarClicked = new EventEmitter();
  @Input() title!: string;
  @ViewChild('upsetPlotBox', { static: true }) upsetPlotElement!: ElementRef;
  destroyRef = inject(DestroyRef);

  svg: unknown;
  width = 300;
  height = 300;
  margin = { top: 5, bottom: 5, left: 5, right: 5 };
  allSetIds: string[] = [];

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   * @type {BehaviorSubject<UpsetData[]>}
   * @private
   */
  protected _data = new BehaviorSubject<UpsetData[]>([]);

  /**
   * pushes changed data to {BehaviorSubject}
   * @param value
   */
  @Input()
  set data(value: Partial<UpsetData>[]) {
    this._data.next(value.map((val) => new UpsetData(val)));
  }

  /**
   * returns value of {BehaviorSubject}
   * @returns UpsetData[]
   */
  get data(): UpsetData[] {
    return this._data.getValue();
  }

  isBrowser =true;

  intersectionSizeScale!:
    | AxisScale<number>
    | (number[] & ScaleLinear<number, number>);

  /**
   * function to redraw/scale the graph on window resize
   */
  @HostListener('window:resize', [])
  onResize() {
    this.redrawChart();
  }

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this._data
      // listen to data as long as term is undefined or null
      // Unsubscribe once term has value
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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
                this.allSetIds.indexOf(d),
              );
            } else {
              combination.connectorIndices = [0, 0];
            }
          });
          this.allSetIds = [...new Set(this.allSetIds)];
          return data;
        }),
      )
      .subscribe((data) => {
        if (this.isBrowser) {
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
    select(element).select('svg').remove();
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    const innerMargin = 10;
    const tooltipMargin = 10;

    // const width = this.width - margin.left - margin.right;
    //  const height = this.height - margin.top - margin.left;

    const leftColWidth = this.width * 0.25;
    const rightColWidth = this.width - leftColWidth - innerMargin;

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


    if (this.scale === 'log') {
      this.intersectionSizeScale = scaleLog()
        .domain([1, this._getMax()])
        .range([topRowHeight, 0]);

      axisLeft(this.intersectionSizeScale)
        .scale(this.intersectionSizeScale)
        .tickFormat((d, i) => {
          return (i % 5 === 0 && format(',d')(Number(d))) || '';
        })
        .tickSize(5);
    } else {
      this.intersectionSizeScale = scaleLinear()
        .domain([1, this._getMax()])
        .range([topRowHeight, 0]);

      axisLeft(this.intersectionSizeScale).tickSize(5);
    }

    // Prepare the overall layout
    const svg = select(element)
      .append('svg:svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('svg:g')
      .attr('transform', `translate(-${leftColWidth / 2},0)`);

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
        `translate(${leftColWidth}, ${topRowHeight + innerMargin})`,
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
        (d: UpsetData) =>  {
          let ret = xScale(d.id);
          if (!ret) {
            ret = 0
          }
          return`translate(${ret + xScale.bandwidth() / 2}, 0)`
        }
      );

    // Select all circles within each group and bind the inner array per data item
    combinationGroup
      .selectAll('circle')
      .data((combination) => combination.combinations)
      .join('circle')
      .classed('member', (d) => d.member)

      .attr(
        'cy',
        (d) => {
           const ret = yCombinationScale(<string>d.setId);
            if(ret) {
              return ret + yCombinationScale.bandwidth() / 2
            } else {
              return  yCombinationScale.bandwidth() / 2
            }
        },
      )
      .attr('r', () => yCombinationScale.bandwidth() / 4);

    // Connect the sets with a vertical line
  //  const connector =
      combinationGroup
      .filter((d) => d.connectorIndices.length > 0)
      .append('svg:line')
      .style('fill', '#265668')
      .attr('class', 'connector')
      .attr(
        'y1',
        (d) => {
        if(d.connectorIndices && d.connectorIndices[0]) {
         return <number>yCombinationScale(<string>this.allSetIds[d.connectorIndices[0]]) +
          <number>yCombinationScale.bandwidth() / 2
        } else {
        return 0
        }
        }
      )
        .attr(
        'y2',
        (d) => {
        if(d.connectorIndices && d.connectorIndices[1]) {
         return <number>yCombinationScale(<string>this.allSetIds[d.connectorIndices[1]]) +
          <number>yCombinationScale.bandwidth() / 2
        } else {
        return 0
        }
        }
      );

    /*
     * Set size chart
     */
    svg
      .append('svg:g')
      .attr('transform', () => `translate(0, ${topRowHeight})`);

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
        (d: string) => <number>yCombinationScale(d) + <number>yCombinationScale.bandwidth() / 2,
      )
      .attr('dy', '0.35em')
      .text((d) => d);


    const intersectionSizeAxis = axisLeft(this.intersectionSizeScale)
      .scale(this.intersectionSizeScale)
      .tickFormat((d, i) => {
        return (i % 5 === 0 && format(',d')(Number(d))) || '';
      })
      .tickSize(5);

    intersectionSizeChart
      .append('g')
      .attr(
        'transform',
        () =>
          `translate(${-(this.margin.left + this.margin.right)}, ${
            this.margin.top + this.margin.bottom
          })`,
      )
      .call(intersectionSizeAxis);

    intersectionSizeChart
      .append('g')
      .attr(
        'transform',
        () => `translate(0, ${this.margin.top + this.margin.bottom})`,
      )
      .selectAll('rect')
      .data(this.data)
      .join('rect')
      .attr('class', 'bar')
      .style('fill', '#265668')
      .attr('height', (d) => {
        let ret = this.intersectionSizeScale(d.size);
        if (!ret) {
          ret = 0
        }
        return topRowHeight - ret;
      })
      .attr('width', xScale.bandwidth())
      .attr('x', (d: UpsetData) => <number>xScale(<string>d.id))
      .attr('y', (d) => {
        let ret = this.intersectionSizeScale(d.size);
        if (!ret) {
          ret = 0
        }
        return ret;
      })
      .on('mouseover', () => {
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
      .attr('transform', () => `translate(0, ${this.margin.top - 1})`)
      .attr('class', 'bar-labels')
      .selectAll('.text')
      .data(this.data)
      .enter()
      .append('text')
      .attr('font-size', '.6em')
      .attr('x', (d: UpsetData) => <number>xScale(<string>d.id))
      .attr('y', (d: UpsetData) => {
        let scale: number = this.margin.top;
        let ret;
          if(d.size > 0) {
            ret = this.intersectionSizeScale(d.size)
          } else {
            ret = this.intersectionSizeScale(1)
          }
        if(ret) {
          scale = scale+ ret;
        }
        return scale;
        }
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

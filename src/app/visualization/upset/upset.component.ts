import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { VisualizationBase } from '../visualization-base';
import { take } from 'rxjs/operators';
import * as d3 from 'd3';
import { UpsetIntersection } from './intersection.model';

@Component({
  selector: 'ramp-upset',
  templateUrl: './upset.component.html',
  styleUrls: ['./upset.component.scss']
})
export class UpsetComponent extends VisualizationBase implements OnInit, AfterViewInit {
  selectedData: Array<any>;
  intersections: Array<UpsetIntersection>;
  soloSets: Array<UpsetIntersection> | any;
  allData: Array<UpsetIntersection>;
  dataNameKey: string;
  dataValuesKey: string;
  isViewInit = false;
  @Input() scale: 'linear'|'log' = 'linear';
  @Input() showSetsSelection = false;
  @Output() upSetBarClicked = new EventEmitter();

  @ViewChild('upsetPlotBox', { read: ElementRef, static: false }) upsetPlotElement: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.svgReady.pipe(take(1)).subscribe(() => {
      this.drawChart();
    });
  }

  ngAfterViewInit(): void {
    this.isViewInit = true;
    this.drawContainer();
  }



  @Input('intersections')
  set intersectionsInput(intersections: Array<UpsetIntersection>) {
    if (intersections != null) {
      this.intersections = intersections;
      this.drawContainer();
    }
  }

  @Input('soloSets')
  set soloSetsInput(soloSets: Array<UpsetIntersection> | any) {
    if (soloSets != null) {
      this.soloSets = soloSets;
      this.drawContainer();
    }
  }

  @Input('allData')
  set allDataInput(allData: Array<UpsetIntersection>) {
    if (allData != null) {
      this.allData = allData;
      this.drawContainer();
    }
  }

  @Input('nameKey')
    set dataXKeyInput(nameKey: string) {
        if (nameKey != null) {
            this.dataNameKey = nameKey;
            this.processData();
            this.svgReady.pipe(take(1)).subscribe(() => {
                this.drawChart();
            });
        }
    }

    @Input('valuesKey')
    set dataYKeyInput(valuesKey: string) {
        if (valuesKey != null) {
            this.dataValuesKey = valuesKey;
            this.processData();
            this.svgReady.pipe(take(1)).subscribe(() => {
                this.drawChart();
            });
        }
    }

  processData(): void {
    super.processData();
    if (this.data != null && this.dataValuesKey != null) {
      this.data = this.data.sort((a, b) => {
        if (a[this.dataValuesKey] == null) {
          a[this.dataValuesKey] = [];
        }
        if (b[this.dataValuesKey] == null) {
          b[this.dataValuesKey] = [];
        }
        if (a[this.dataValuesKey].length > b[this.dataValuesKey].length) {
          return -1;
        }
        if (b[this.dataValuesKey].length > a[this.dataValuesKey].length) {
          return 1;
        }
        return 0;
      });
      this.selectedData = [];
      for (let i = 0; i < this.data.length; i++) {
        if (i < 5) {
          this.data[i].isSelected = true;
          this.selectedData.push(this.data[i]);
        } else {
          break;
        }
      }
      this.formatIntersectionData();
      this.allData = this.insertSoloDataOutersect();
      this.drawContainer();
    }
  }

  redrawPlot(): void {
    this.selectedData = this.data.filter(item => item.isSelected);
    this.formatIntersectionData();
    this.allData = this.insertSoloDataOutersect();
    d3.select(this.upsetPlotElement.nativeElement).selectAll('*').remove();
    this.drawContainer();
    this.drawChart();
  }

  drawContainer(): void {
    if (this.isViewInit && this.allData && this.soloSets) {
      let maxLabelSize = 0;
      this.soloSets.forEach(element => {
        if (element.name.length > maxLabelSize) {
          maxLabelSize = element.name.length;
        }
      });
      const marginLeft = maxLabelSize * 10.30;
      const height = 400;
      const marginBottom = this.soloSets.length * 45;
      const width = 52 + ((this.allData.length - 1) * (13 * 2.7));
      this.createSvg(this.upsetPlotElement.nativeElement, width, height, marginLeft, marginBottom, 0, 20);
    }
  }

  // format intersection data
  formatIntersectionData() {

    if (this.selectedData != null && this.dataValuesKey != null && this.dataNameKey != null && this.scale) {
      // compiling solo set data - how many values per set
      const soloSets = [];

      // nameStr is for the setName, which makes it easy to compile
      // each name would be A, then B, so on..
      const nameStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substr(0, this.selectedData.length);

      this.selectedData.forEach((x, i) => {
        soloSets.push({
          name: x[this.dataNameKey],
          setName: nameStr.substr(i, 1),
          num: x[this.dataValuesKey].length,
          values: x[this.dataValuesKey],
        });
      });

      let intNames = this.getIntNames(0, nameStr.length, nameStr);

      // removing solo names
      intNames = intNames.filter((x) => x.length !== 1);

      let intersections = [];

      // compile intersections of values for each intersection name
      intNames.forEach((intName) => {
        // collecting all values: [pub1arr, pub2arr, ...]
        const values = intName.split('').map((set) => soloSets.find((x) => x.setName === set).values);

        // getting intersection
        // https://stackoverflow.com/questions/37320296/how-to-calculate-intersection-of-multiple-arrays-in-javascript-and-what-does-e
        const result = values.reduce((a, b) => a.filter((c) => b.includes(c)));
        intersections.push({
          name: intName.split('').map((set) => soloSets.find((x) => x.setName === set).name).join(' + '),
          setName: intName,
          num: result.length,
          values: result,
        });

      });

      // taking out all 0s
      intersections = intersections.filter((x) => x.value !== 0);
      this.intersections = intersections;
      this.soloSets = soloSets;
    }
  }

  // compiling list of intersection names recursively
  // ['A', 'AB', 'ABC', ...]
  getIntNames(start, end, nameStr) {
    // eg. BCD
    const name = nameStr.substring(start, end);

    // when reaching the last letter
    if (name.length === 1) {
      return [name];
    }
    const retArr = this.getIntNames(start + 1, end, nameStr);

    // eg. for name = BCD, would return [B] + [BC,BCD,BD] + [C,CD,D]
    return [name[0]].concat(retArr.map((x) => name[0] + x), retArr);
  }

  // include solo sets with all its data
  insertSoloDataAll() {
    const allData = this.intersections.slice();
    this.soloSets.forEach(x => {
      allData.push(x);
    });
    return allData;
  }

  // include solo sets with only the values that ARE NOT in other sets
  insertSoloDataOutersect() {
    if (this.intersections != null && this.soloSets != null) {
      const allData = this.intersections.slice();
      const soloSets = this.soloSets.slice();
      soloSets.forEach(x => {
        // compile all unique values from other sets except current set
        const otherSets = [...new Set(soloSets.map(y => y.setName === x.setName ? [] : y.values).flat())];

        // subtract otherSets values from current set values
        const values = x.values.filter(y => !otherSets.includes(y));
        allData.push({
          name: x.name,
          setName: x.setName,
          num: values.length,
          // tslint:disable-next-line:object-literal-shorthand
          values: values,
        });

      });
      return allData;
    }
  }

  drawChart() {

    if (this.svg != null && this.allData != null && this.soloSets != null) {

      // all sets
      const allSetNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substr(0, this.soloSets.length).split('');

      const rad = 13;

      const width = 42 + ((this.allData.length - 1) * (rad * 2.7));
      const height = 400;

      // make the canvas
      this.svg
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('class', 'plot')
        .append('g')
        .attr('fill', 'white');

      // make a group for the upset circle intersection things
      const upsetCircles = this.svg.append('g')
        .attr('id', 'upsetCircles')
        .attr('transform', `translate(20,${height + 40})`);

      // making dataset labels
      this.soloSets.forEach((x, i) => {
        upsetCircles.append('text')
          .attr('dx', -30)
          .attr('dy', 5 + i * (rad * 2.7))
          .attr('text-anchor', 'end')
          .attr('fill', 'black')
          .style('font-size', 15)
          .text(x.name);
      });

      // sort data decreasing
      // this.allData.sort((a, b) => parseFloat(b.num.toString()) - parseFloat(a.num.toString()));
      this.allData.sort((a, b) => parseFloat(a.name.split(' + ').length.toString()) - parseFloat(b.name.split(' + ').length.toString()));

      // make the bars
      const upsetBars = this.svg.append('g')
        .attr('id', 'upsetBars');

      const nums: Array<any> = this.allData.map((x) => x.num);

      // set range for data by domain, and scale by range

      let yrange;
      let yAxis;

      if (this.scale === 'log') {
        yrange = d3.scaleLog()
          .domain([1, d3.max(nums)])
          .range([height, 0]);

        yAxis = d3.axisLeft(yrange)
          .scale(yrange)
          .tickFormat((d, i) => {
            return i % 5 === 0 && d3.format(',d')(Number(d)) || '';
          })
          .tickSize(5);

      } else {
        yrange = d3.scaleLinear()
          .domain([0, d3.max(nums)])
          .range([height, 0]);

        yAxis = d3.axisLeft(yrange)
          // .scale(yrange)
          .tickSize(5);
      }

      const xrange = d3.scaleLinear()
        .domain([0, nums.length])
        .range([0, width]);

      // set axes for graph
      const xAxis = d3.axisBottom(xrange)
        // .scale(xrange)
        .tickPadding(2)
        .tickFormat((d, i) => this.allData[i].setName)
        .tickValues(d3.range(this.allData.length));

      // add X axis
      upsetBars.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .call(xAxis)
        .selectAll('.tick')
        .remove();


      // Add the Y Axis
      upsetBars.append('g')
        .attr('class', 'y axis')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .call(yAxis)
        .selectAll('text')
        .attr('fill', 'black')
        .attr('stroke', 'none');


      const chart = upsetBars.append('g')
        .attr('transform', 'translate(1,0)')
        .attr('id', 'chart');

      // adding each bar
      const bars = chart.selectAll('.bar')
        .data(this.allData)
        .enter()
        .append('rect')
        .attr('class', 'bar clickable')
        .attr('width', 20)
        .attr('x', (d, i) => 12 + i * (rad * 2.7))
        .attr('y', (d) => yrange(d.num))
        .style('fill', '#6A1B9A')
        .attr('height', (d) => height - yrange(d.num))
        .on('click', (d, i) => { this.upSetBarClicked.emit(i); });

      const labels = chart.selectAll('.text')
        .data(this.allData)
        .enter()
        .append('text')
        .attr('font-size', 11)
        .attr('dy', '.75em')
        .attr('x', (d, i) => 12 + i * (rad * 2.7) + 10)
        .attr('y', (d) => yrange(d.num) - 13)
        .attr('text-anchor', 'middle')
        .text((d) => d3.format(',d')(Number(d.num)));

      // circles
      this.allData.forEach((x, i) => {
        allSetNames.forEach((y, j) => {
          upsetCircles.append('circle')
            .attr('cx', i * (rad * 2.7) + 3)
            .attr('cy', j * (rad * 2.7))
            .attr('r', rad)
            .attr('class', `set-${x.setName}`)
            .style('opacity', 1)
            .attr('fill', () => {
              if (x.setName.indexOf(y) !== -1) {
                return '#6A1B9A';
              }
              return 'silver';
            });
        });

        upsetCircles.append('line')
          .attr('id', `setline${i}`)
          .attr('x1', i * (rad * 2.7))
          .attr('y1', allSetNames.indexOf(x.setName[0]) * (rad * 2.7))
          .attr('x2', i * (rad * 2.7))
          .attr('y2', allSetNames.indexOf(x.setName[x.setName.length - 1]) * (rad * 2.7))
          .style('stroke', '#6A1B9A')
          .attr('stroke-width', 4);
      });
    }
  }
}

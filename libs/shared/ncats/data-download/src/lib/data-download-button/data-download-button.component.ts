import {DOCUMENT} from "@angular/common";
import {Component, Inject, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ramp-data-download-button',
  templateUrl: './data-download-button.component.html',
  styleUrls: ['./data-download-button.component.scss']
})
export class DataDownloadButtonComponent implements OnInit {
  @Input() source!: string;
  @Input() data!: any;
  file!: any;

  constructor(
    @Inject(DOCUMENT) private dom: Document
  ) {
  }

  ngOnInit(): void {
  }

  downloadData(): void {
    const lines: string[] = [[...Object.keys(this.data[0])].join(',')];
    this.data.forEach((data: any) => lines.push([...(Object.values(data))].join(',')));
    const csv = lines.join('\n');
    this.file = new Blob([csv], {type: 'text/csv'});
    var link = this.dom.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(this.file);
      link.setAttribute("href", url);
      link.setAttribute("download", `${this.source}-download.csv`);
      link.style.visibility = 'hidden';
      this.dom.body.appendChild(link);
      link.click();
      this.dom.body.removeChild(link);
    }
  }
}

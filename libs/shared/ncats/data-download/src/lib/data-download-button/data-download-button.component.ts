import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';

@Component({
  selector: 'ramp-data-download-button',
  templateUrl: './data-download-button.component.html',
  styleUrls: ['./data-download-button.component.scss'],
})
export class DataDownloadButtonComponent {
  @Input() source!: string;
  @Input() data!: any;
  file!: any;

  constructor(@Inject(DOCUMENT) private dom: Document) {}

  downloadData(): void {
    const lines: string[] = [[...Object.keys(this.data[0])].join(',')];
    this.data.forEach((data: any) =>
      lines.push([...Object.values(data)].join('\t')),
    );
    const csv = lines.join('\n');
    this.file = new Blob([csv], { type: 'text/tsv' });
    const link = this.dom.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(this.file);
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.source}-download.tsv`);
      link.style.visibility = 'hidden';
      this.dom.body.appendChild(link);
      link.click();
      this.dom.body.removeChild(link);
    }
  }
}

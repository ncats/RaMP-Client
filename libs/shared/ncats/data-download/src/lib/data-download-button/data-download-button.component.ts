import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ramp-data-download-button',
  templateUrl: './data-download-button.component.html',
  styleUrls: ['./data-download-button.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule, MatIconModule],
})
export class DataDownloadButtonComponent {
  @Input() source!: string;
  @Input() data!: unknown[];


  constructor(@Inject(DOCUMENT) private dom: Document) {}

  downloadData(): void {
    const firstRow = this.data[0] as {[key: string]: unknown};
    const keys: string[] = [...Object.keys(firstRow)]
    const lines: string[] = [keys.join(',')];
    this.data.forEach((data: unknown) =>{
      const values: string[] = [...Object.values(data as {[key: string]: unknown})] as string[];
      lines.push(values.join('\t'))
  });
    const csv = lines.join('\n');
    const file = new Blob([csv], { type: 'text/tsv' });
    const link = this.dom.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(file);
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.source}-download.tsv`);
      link.style.visibility = 'hidden';
      this.dom.body.appendChild(link);
      link.click();
      this.dom.body.removeChild(link);
    }
  }
}

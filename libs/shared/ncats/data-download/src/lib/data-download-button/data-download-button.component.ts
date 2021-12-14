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

  /*  downloadData() {
      if (this.data) {
      //  const csv = this.convertToCSV();
     //   console.log(csv);
     //   const csvBlob = new Blob([csv], {type: 'text/plain;charset=utf-8'});
  //  zip.generateAsync({type: 'blob'}).then((content) => {
        // saveAs(content, 'pharos data download.zip');
  //});
      }
    }*/
  private browser: any;

  downloadData(): void {
    console.log(this.data);
    const lines: string[] = [[...Object.keys(this.data[0])].join(',')];
    this.data.forEach((data: any) => lines.push([...(Object.values(data))].join(',')));
    const csv = lines.join('\n');
    console.log(csv);
    this.file = new Blob([csv], {type: 'text/csv'});
 /*   this.browser.downloads.download(
      filename: `${this.source}-download.csv`,
      url: window.URL.createObjectURL(this.file)
    // object
    )*/
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
   // this.link.href = window.URL.createObjectURL(this.file);
  //  this.link.click();

   // this.link..download = 'drugGenerator.tsv';
//    this.downloadFile();
  }

  downloadFile(): void {
    // let url = window.URL.createObjectURL(this.file);
  //  this.link.href = window.URL.createObjectURL(this.file);
  //  this.link.click();
    // window.open(url);
  }
}

/*
    function exportCSVFile(headers, items, fileTitle) {
      if (headers) {
        items.unshift(headers);
      }

      // Convert Object to JSON
      var jsonObject = JSON.stringify(items);

      var csv = this.convertToCSV(jsonObject);

      var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    }
  }



  convertToCSV() {
    var array = typeof this.data != 'object' ? JSON.parse(this.data) : this.data;
    var str = '';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
        line += array[i][index];
      }
      str += line + '\r\n';
    }

    return str;
  }
}*/

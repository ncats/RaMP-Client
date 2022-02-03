import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

/**
 * Pipe to highlight searcch text in results
 */
@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  /**
   * parses a string to return highlighted search text
   * @param {string} text
   * @param {string} search
   * @returns {string}
   */
  constructor(
    private sanitizer: DomSanitizer
  ) {

  }
  transform(text: string, search: string): SafeHtml | string {
    if (search && text) {
      let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      pattern = pattern.split(' ').filter((t) => {
        return t.length > 0;
      }).join('|');
      const regex = new RegExp(pattern, 'gi');
console.log(text)
      return this.sanitizer.bypassSecurityTrustHtml(
        text.replace(regex, (match) => `<span style="font-weight:900;" class="search-highlight">${match}</span>`)
      );
    } else {
      return text;
    }
  }
}

/**
 * object to manage pagination changes, used in custom pharos paginator
 */
export class PageData {
  /**
   * total number of results
   */
  total: number;

  /**
   * current count
   */
  count: number;

  /**
   * current page number
   */
  skip: number;

  /**
   * number of results to return (page length)
   */
  top: number;

  /**
   * deonstruct object into class
   * @param obj
   */
  constructor(obj: any) {
    this.total = obj.total ? obj.total : 0;
    this.count = obj.count ? obj.count : 0;
    this.skip = obj.skip ? obj.skip : 0;
    this.top = obj.top ? obj.top : 0;
  }
}

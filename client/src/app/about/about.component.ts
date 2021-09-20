import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UpsetIntersection } from '../visualization/upset/intersection.model';
import { ConfigService } from '../config/config.service';
import { SourceVersion } from './source-version.model';
import { EntityCount, SourceCount } from './entity-count.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ramp-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  genesIntersections: Array<UpsetIntersection>;
  genesSoloSets: Array<UpsetIntersection> | any;
  genesAllData: Array<UpsetIntersection>;
  compoundsIntersections: Array<UpsetIntersection>;
  compoundsSoloSets: Array<UpsetIntersection> | any;
  compoundsAllData: Array<UpsetIntersection>;
  apiBaseUrl: string;
  @ViewChild('briefDescription', { static: false }) briefDescription: ElementRef<HTMLElement>;
  @ViewChild('contact', { static: false }) contact: ElementRef<HTMLElement>;
  @ViewChild('citation', { static: false }) citation: ElementRef<HTMLElement>;
  @ViewChild('summaryStatistics', { static: false }) summaryStatistics: ElementRef<HTMLElement>;
  elementsDict: { [elementName: string]: ElementRef<HTMLElement> } = {};
  sourceVersions: Array<SourceVersion>;
  entityCounts: Array<EntityCount>;
  entityCountsColumns: Array<string> = [''];

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private route: ActivatedRoute
  ) {
    this.apiBaseUrl = configService.configData.apiBaseUrl;
  }

  ngOnInit(): void {
    this.getVersionInfo();
    this.setEntityCounts();
    this.getAnalytesSourceIntersects();
  }

  ngAfterViewInit(): void {
    // tslint:disable-next-line:no-string-literal
    this.elementsDict['briefDescription'] = this.briefDescription;
    // tslint:disable-next-line:no-string-literal
    this.elementsDict['contact'] = this.contact;
    // tslint:disable-next-line:no-string-literal
    this.elementsDict['citation'] = this.citation;
    // tslint:disable-next-line:no-string-literal
    this.elementsDict['summaryStatistics'] = this.summaryStatistics;
    this.route.queryParams.pipe(
      filter(params => params.scrollTo)
    )
    .subscribe(params => {
        this.scrollTo(params.scrollTo);
      }
    );
  }

  getVersionInfo(): void {
    const url = `${this.apiBaseUrl}source_versions`;
    this.http.get<Array<SourceVersion>>(url).subscribe(response => {
      this.sourceVersions = response;
    });
  }

  setEntityCounts(): void {
    const url = `${this.apiBaseUrl}entity_counts`;
    this.http.get<Array<SourceCount>>(url).subscribe((response) => {
      if (!response || !response.length) {
        response = [];
      }
      this.entityCounts = this.processEntityCounts(response);
      console.log(this.entityCounts);
    });
  }

  private processEntityCounts(sourceCounts: Array<SourceCount>): Array<EntityCount> {
    const group = new Map();
    sourceCounts.forEach(sourceCount => {
      const key = sourceCount.entity;
      const collection = group.get(key);
      if (!collection) {
        const countDict = {};
        countDict[sourceCount.entitySourceName] = sourceCount.entityCount;
        group.set(key, countDict);
      } else {
        collection[sourceCount.entitySourceName] = sourceCount.entityCount;
      }
      if (this.entityCountsColumns.indexOf(sourceCount.entitySourceName) === -1) {
        this.entityCountsColumns.push(sourceCount.entitySourceName);
      }
    });
    const entityCounts = Array.from(group, element => {
      return {
        entity: element[0],
        counts: element[1]
      };
    });
    return entityCounts;
  }

  getAnalytesSourceIntersects(): void {
    const url = `${this.apiBaseUrl}analyte_intersects`;

    const genesIntersections: Array<UpsetIntersection> = [];
    const genesSoloSets: Array<UpsetIntersection> | any = [];
    const genesAllData: Array<UpsetIntersection> = [];
    const compoundsIntersections: Array<UpsetIntersection> = [];
    const compoundsSoloSets: Array<UpsetIntersection> | any = [];
    const compoundsAllData: Array<UpsetIntersection> = [];

    this.http.get<any>(url).pipe(
      map((response) => {
        Object.keys(response).forEach(key => {
          response[key].map(intercept => {
            if (typeof intercept.sets === 'string') {
              intercept.sets = [intercept.sets];
            }
            return intercept;
          });
        });
        return response;
      })
    ).subscribe(response => {
      const nameStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      let compoundNameStrIndex = 0;
      const compoundSetNameDict = {};
      const compounds = response.compounds.sort((a, b) => {
        if (a.sets.length < b.sets.length) {
          return -1;
        }
        if (b.sets.length < a.sets.length) {
          return 1;
        }
        if (a.sets[0] < b.sets[0]) {
          return -1;
        }
        if (b.sets[0] < a.sets[0]) {
          return 1;
        }
        return 0;
      });

      let geneNameStrIndex = 0;
      const geneSetNameDict = {};
      const genes = response.genes.sort((a, b) => {
        if (a.sets.length < b.sets.length) {
          return -1;
        }
        if (b.sets.length < a.sets.length) {
          return 1;
        }
        if (a.sets[0] < b.sets[0]) {
          return -1;
        }
        if (b.sets[0] < a.sets[0]) {
          return 1;
        }
        return 0;
      });

      for (let i = 0; i < compounds.length; i++) {
        let compoundIntersection: UpsetIntersection;

        if (compounds[i].sets.length === 1) {

          compoundIntersection = {
            name: compounds[i].sets[0],
            num: compounds[i].size,
            setName: nameStr.substr(compoundNameStrIndex, 1)
          };
          compoundsSoloSets.push(compoundIntersection);
          compoundSetNameDict[compoundIntersection.name]  = compoundIntersection.setName;
          compoundNameStrIndex++;
        } else if (compounds[i].sets.length > 1) {
          compoundIntersection = {
            name: response.compounds[i].sets.sort().join(' + '),
            num: response.compounds[i].size,
          };
          compoundIntersection.setName = '';
          response.compounds[i].sets.forEach(set => {
            compoundIntersection.setName += compoundSetNameDict[set];
          });
          compoundsIntersections.push(compoundIntersection);
        }

        compoundsAllData.push(compoundIntersection);

        let geneIntersection: UpsetIntersection;
        if (genes[i].sets.length === 1) {

          geneIntersection = {
            name: genes[i].sets[0],
            num: genes[i].size,
            setName: nameStr.substr(geneNameStrIndex, 1)
          };

          genesSoloSets.push(geneIntersection);
          geneSetNameDict[geneIntersection.name]  = geneIntersection.setName;
          geneNameStrIndex++;
        } else if (genes[i].sets.length > 1) {
          geneIntersection = {
            name: response.genes[i].sets.sort().join(' + '),
            num: response.genes[i].size,
          };
          geneIntersection.setName = '';
          response.genes[i].sets.forEach(set => {
            geneIntersection.setName += geneSetNameDict[set];
          });
          genesIntersections.push(geneIntersection);
        }
        genesAllData.push(geneIntersection);
      }

      this.genesIntersections = genesIntersections;
      this.genesSoloSets = genesSoloSets;
      this.genesAllData = genesAllData;
      this.compoundsIntersections = compoundsIntersections;
      this.compoundsSoloSets = compoundsSoloSets;
      this.compoundsAllData = compoundsAllData;
    });
  }

  scrollTo(element: string): void {
    this.elementsDict[element].nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

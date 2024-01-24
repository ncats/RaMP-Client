import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ncats-footer',
  templateUrl: './ncats-footer.component.html',
  styleUrls: ['./ncats-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatIconModule],
})
export class NcatsFooterComponent {}

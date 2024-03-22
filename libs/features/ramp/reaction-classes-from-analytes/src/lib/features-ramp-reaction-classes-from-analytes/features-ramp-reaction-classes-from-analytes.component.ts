import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { InputRowComponent } from "@ramp/shared/ramp/input-row";
import { PageCoreComponent } from "@ramp/shared/ramp/page-core";
import { QueryPageComponent } from "@ramp/shared/ramp/query-page";
import { DescriptionComponent } from "@ramp/shared/ui/description-panel";
import { FeedbackPanelComponent } from "@ramp/shared/ui/feedback-panel";

@Component({
  selector: 'lib-features-ramp-reaction-classes-from-analytes',
  standalone: true,
  imports: [
    CommonModule,
    DescriptionComponent,
    InputRowComponent,
    FeedbackPanelComponent,
    QueryPageComponent,
    TitleCasePipe,
  ],
  templateUrl: './features-ramp-reaction-classes-from-analytes.component.html',
  styleUrl: './features-ramp-reaction-classes-from-analytes.component.scss',
})
export class FeaturesRampReactionClassesFromAnalytesComponent
  extends PageCoreComponent
  implements OnInit {

  constructor(private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
  }

}

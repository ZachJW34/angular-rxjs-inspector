import { Component, ChangeDetectorRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = new BehaviorSubject("angular-ext");
  constructor(private changeDetection: ChangeDetectorRef) {
    chrome.devtools.inspectedWindow.eval(
      `(function(){
      var ng = window.ng;
      var ngElement = document.querySelector('[ng-version]');
      var ngVersion;
      if (ngElement) {
      ngVersion = ngElement.getAttribute('ng-version')
      }
      return { ng: ng, ngVersion: ngVersion }
      })()`,
      (res: any, isException) => {
        if (isException) {
          this.title.next("Exception when trying to eval");
          this.changeDetection.detectChanges();
          return;
        }
        const { ng, ngVersion } = res;
        if (!ng) {
          this.title.next("Could not find angular debugging data");
          this.changeDetection.detectChanges();
          return;
        }
        if (!ngVersion) {
          this.title.next("Could not find Angular version");
          this.changeDetection.detectChanges();
        }
        this.title.next(ngVersion);
        this.changeDetection.detectChanges();
      }
    );
  }
}

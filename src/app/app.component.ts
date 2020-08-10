import { Component, VERSION } from '@angular/core';
import { Country, Covid19ApiService } from './covid19-api.service'; 
import { Observable, Subject } from 'rxjs';
import {
  tap,
  switchMap,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;

  loading: boolean = false;
  countries$: Observable<Country[]>;
  private searchTerms = new Subject<string>();

  covidResults$: Observable<object>;

  constructor(private countryService: Covid19ApiService) { }

  search(term: string) {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
/*     this.countries$ = this.searchTerms.pipe(
      tap(_ => this.loading = true),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.countryService.searchCountry(term)),
      tap(_ => this.loading = false)
    ) */

    this.countryService.getLatest()
      .subscribe(response => { 
        this.covidResults$ = response;
        console.log(this.covidResults$);
        } );
  }
}

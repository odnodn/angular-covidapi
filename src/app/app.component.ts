import { Component, VERSION } from '@angular/core';
import { Covid19ApiService } from './covid19-api.service'; 
import { Observable, Subject } from 'rxjs';
import {
  tap,
  switchMap,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";

// count 188 date 2020-08-09 result Array[188]- confirmed deaths recovered
export class covidData {
    count: number;
    date: string;
    result: Array<Country>;
}

export class Country{
  countryname: string;
  confirmed: number;
  deaths: number;
  recovered: number;
}


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

  covidResults$: Observable<covidData>;
  covidResults: any;

  constructor(private covidService: Covid19ApiService) { }

  search(term: string) {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
/*     this.countries$ = this.searchTerms.pipe(
      tap(_ => this.loading = true),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.covidService.searchCovid(term)),
      tap(_ => this.loading = false)
    ) */

    this.covidService.getLatest()
      .subscribe(response => { 
        this.covidResults$ = response;
        this.covidResults = response.result;
        this.rebuild(response.result);
        // console.log(JSON.stringify(this.covidResults$));
        //console.log(this.covidResults);
        } );
  }

  countryData: Country[];

  rebuild(result: []){
      this.countryData

      result.forEach( item => {
          this.rebuildItem(item); //console.log(item)
      })
  }

  rebuildItem(result){
    let country: Country = new Country();

    // console.log(Object.getOwnPropertyNames(result) );
    // console.log(result[Object.getOwnPropertyNames(result)].confirmed)
    country.countryname = Object.getOwnPropertyNames(result)[0];
    country.confirmed = result[Object.getOwnPropertyNames(result)].confirmed;
    country.deaths = result[Object.getOwnPropertyNames(result)].deaths;
    country.recovered = result[Object.getOwnPropertyNames(result)].recovered;
    // console.log(country);
  }
}

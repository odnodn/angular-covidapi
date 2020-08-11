import { Component, VERSION } from '@angular/core';
import { Covid19ApiService } from './covid19-api.service'; 
import { Observable, Subject } from 'rxjs';
import {
  tap,
  switchMap,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";

import { iso } from './data/iso-3166';
import {cities} from 'country-json';
import populations from './data/country-by-population.json'

// count 188 date 2020-08-09 result Array[188]- confirmed deaths recovered
export class covidData {
    count: number;
    date: string;
    result: Array<Country>;
}

export class Country{
  symbol: string;
  countryname: string;
  population: number;
  confirmed: number;
  confirmedPerPop: number;
  deaths: number;
  deathsPerPop: number;
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

  console.log(populations[0]);
  

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
      this.countryData = [];

      result.forEach( item => {
          this.rebuildItem(item); //console.log(item)
      })
  }

  rebuildItem(result){
    let country: Country = new Country();

    // console.log(Object.getOwnPropertyNames(result) );
    // console.log(result[Object.getOwnPropertyNames(result)].confirmed)

    var countryName = Object.getOwnPropertyNames(result)[0];
    var confirmed =result[Object.getOwnPropertyNames(result)].confirmed;
    var deaths = result[Object.getOwnPropertyNames(result)].deaths;
    var recovered = result[Object.getOwnPropertyNames(result)].recovered;
    // console.log(iso.whereAlpha3(countryName))
    //country.countryname = Object.getOwnPropertyNames(result)[0];
    //country.countryname = iso.whereAlpha3(countryName).country;       // TODO
    var countryLookup;
    if (iso.whereAlpha3(countryName)) {countryLookup = iso.whereAlpha3(countryName).country} else { countryLookup = ""};
    var population, confirmedPerPop, deathsPerPop;
    var pop = populations.find((country) => country.country.toUpperCase() === countryLookup.toUpperCase());
    if (pop) {
      population = pop.population;
      confirmedPerPop = Math.round(confirmed * (100000/population));
      deathsPerPop =  Math.round(deaths * (100000/population));
      } else 
      { 
        population = "";
        };
    country.symbol = countryName;
    country.countryname = countryLookup;
    country.population = population;
    country.confirmedPerPop = confirmedPerPop;
    country.confirmed = confirmed;
    country.deaths = deaths;
    country.deathsPerPop = deathsPerPop;
    country.recovered = recovered;
    // console.log(country);
    this.countryData.push(country);
    
  }
}

// x      100TSD
// cases  population
// x = 100.000 / population * confirmed

// https://covidapi.info/api/v1/country/DEU/latest
// https://ourworldindata.org/covid-cases?country=~debounceTime
// https://covid.ourworldindata.org/data/owid-covid-data.json
// https://github.com/samayo/country-json
// https://restcountries.eu/rest/v2/all

 // https://www.programmableweb.com/api/robert-koch-institut-covid-19-data-rest-api-v10
// https://dataconomy.com/2020/04/apis-to-track-coronavirus-covid-19/
// https://www.freecodecamp.org/news/how-to-create-corona-tracker-app-in-3-days/
// https://github.com/marlon360/rki-covid-api


// https://www.npmjs.com/search?q=keywords:coronavirus
// https://github.com/ChrisMichaelPerezSantiago/covid19#readme
// https://github.com/disease-sh/node-api#readme

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
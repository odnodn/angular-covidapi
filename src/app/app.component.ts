import { Component, ViewChild, VERSION } from "@angular/core";
import { Covid19ApiService } from "./covid19-api.service";
import { Observable, Subject } from "rxjs";
import {
  tap,
  switchMap,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";

// syncfusion
import {
  GridComponent,
  ToolbarItems,
  GroupSettingsModel
} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";

// data
import { iso } from "./data/iso-3166";
import cities from "./data/countries.json";
import populations from "./data/country-by-population.json";

// count 188 date 2020-08-09 result Array[188]- confirmed deaths recovered
export class covidData {
  count: number;
  date: string;
  result: Array<Country>;
}

export class Country {
  symbol: string;
  continent: string;
  countryname: string;
  population: number;
  confirmed: number;
  confirmedPerPop: number;
  deaths: number;
  deathsPerPop: number;
  recovered: number;
}

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;

  // data
  loading: boolean = false;
  countries$: Observable<Country[]>;
  private searchTerms = new Subject<string>();

  covidResults$: Observable<covidData>;
  covidResults: any;

  // grid
  // aggregates: sum, average, min, max, count, trueCount, FalseCount
  // public groupOptions: GroupSettingsModel = { showDropArea: true, columns: ['deathsPerPop'] };
  public toolbarOptions: ToolbarItems[];
  @ViewChild("grid") public grid: GridComponent;

  constructor(private covidService: Covid19ApiService) {}

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

    // grid
    this.toolbarOptions = [
      'ExcelExport',
      'CsvExport',
      'PdfExport',
      {
        text: "Expand All",
        tooltipText: "Expand All",
        prefixIcon: "e-expand",
        id: "expandall",
        align: "Right"
      },
      {
        text: "Collapse All",
        tooltipText: "collection All",
        prefixIcon: "e-collapse",
        id: "collapseall",
        align: "Right"
      }
    ];

    console.log(populations[0]);
    console.log(cities[0]);

    this.covidService.getLatest().subscribe(response => {
      this.covidResults$ = response;
      this.covidResults = response.result;
      this.rebuild(response.result);
      // console.log(JSON.stringify(this.covidResults$));
      //console.log(this.covidResults);
    });
  }

  countryData: Country[];

  rebuild(result: []) {
    this.countryData = [];

    result.forEach(item => {
      this.rebuildItem(item); //console.log(item)
    });
  }

  rebuildItem(result) {
    let country: Country = new Country();

    // console.log(Object.getOwnPropertyNames(result) );
    // console.log(result[Object.getOwnPropertyNames(result)].confirmed)

    var countryNameAlpha3 = Object.getOwnPropertyNames(result)[0]; // [ "USA": {confirmed: , deaths: , recovered: }] -> USA
    var confirmed = result[Object.getOwnPropertyNames(result)].confirmed; // -> confirmed
    var deaths = result[Object.getOwnPropertyNames(result)].deaths; // -> deaths
    var recovered = result[Object.getOwnPropertyNames(result)].recovered; // -> recovered
    // console.log(iso.whereAlpha3(countryName))
    //country.countryname = Object.getOwnPropertyNames(result)[0];
    //country.countryname = iso.whereAlpha3(countryName).country;       // TODO
    var countryLookup = this.getCountry(countryNameAlpha3);

    var population = this.getPopulation(countryLookup),
      confirmedPerPop = this.getConfirmedPerPop(confirmed, population),
      deathsPerPop = this.getDeathsPerPop(deaths, population);

    country.symbol = countryNameAlpha3;
    country.continent = this.getContinent(countryNameAlpha3);
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

  getCountry(alphaCode: string): string {
    var countryLookup;
    if (iso.whereAlpha3(alphaCode)) {
      countryLookup = iso.whereAlpha3(alphaCode).country;

      // corrections
      switch (countryLookup) {
        case "United States of America":
          countryLookup = "United States";
          break;
        case "United Kingdom of Great Britain and Northern Ireland":
          countryLookup = "United Kingdom";
          break;
        case "Viet Nam":
          countryLookup = "Vietnam";
          break;
        case "Venezuela":
          break; // ToDo
        case "Lybia":
          break; // ToDo
        case "Islamic Republic of Iran":
          break; // ToDo
        case "Republic of Korea":
          break; // ToDo
        case "Republic of Moldova":
          break; // ToDo
      }
    } else {
      countryLookup = "";
    }
    return countryLookup;
  }

  getContinent(countryNameAlpha3: string) {
    if (!countryNameAlpha3) return "";
    var continentlookup, continent;
    continentlookup = cities.find(item => item.alpha_3 === countryNameAlpha3);
    if (continentlookup) {
      continent = continentlookup.continent;

      switch (continent) {
        case "EU":
          continent = "Europa";
          break;
        case "NA":
          continent = "Nordamerika";
          break;
        case "SA":
          continent = "Südamerika";
          break;
        case "AS":
          continent = "Asien";
          break;
        case "AF":
          continent = "Afrika";
          break;
        case "OC":
          continent = "O";
          break;
      }

      return continent;
    } else {
      return "";
    }
  }

  getPopulation(countryName: string): number {
    var population;
    var pop = populations.find(
      country => country.country.toUpperCase() === countryName.toUpperCase()
    );
    if (pop) {
      population = pop.population;
    } else {
      population = 0;
    }
    return population;
  }

  getConfirmedPerPop(confirmed: number, population: number): number {
    if (population === 0) return 0;

    var confirmedPerPop;
    confirmedPerPop = Math.round(confirmed * (100000 / population));
    return confirmedPerPop;
  }

  getDeathsPerPop(deaths: number, population: number): number {
    if (population === 0) return 0;

    var deathsPerPop;
    deathsPerPop = Math.round(deaths * (100000 / population));
    return deathsPerPop;
  }

  getStats(confirmed: number, deaths: number, population: number): [] {
    return [];
  }

  // ToDo
  // grid
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === "Grid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
    }
    if (args.item.id === "expandall") {
      this.grid.groupModule.expandAll();
    }

    if (args.item.id === "collapseall") {
      this.grid.groupModule.collapseAll();
    }
  }

  enable() {
    this.grid.toolbarModule.enableItems(["Grid_Collapse", "Grid_Expand"], true); // Enable toolbar items.
  }

  disable() {
    this.grid.toolbarModule.enableItems(  ["Grid_Collapse", "Grid_Expand"], false ); // Disable toolbar items.
  }
}

/**
 * 
SCHEMA
countries.json
  continent	      EU AS NA SA AF AN OC 
  population
  alpha_2
  alpha_3
 * 
 */
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

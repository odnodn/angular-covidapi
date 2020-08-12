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
  GroupSettingsModel,
  ColumnModel
} from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs } from "@syncfusion/ej2-angular-navigations";

// csv
import { Papa } from "ngx-papaparse";

// data
import { iso } from "./data/iso-3166";
import cities from "./data/countries.json";
import populations from "./data/country-by-population.json";

import { csv1 } from "./test";
import { csv2 } from "./test";

import { inhalationswirkstoffe } from "./data/inhalationswirkstoffe";

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

  de_lastest: any;
  covidGermany: any;

  inhalationswirkstoffe = inhalationswirkstoffe;

  // grid
  // aggregates: sum, average, min, max, count, trueCount, FalseCount
  // public groupOptions: GroupSettingsModel = { showDropArea: true, columns: ['deathsPerPop'] };
  @ViewChild("grid") public grid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  public sortOptions: object;
  public confirmedColumns: ColumnModel[];
  public deathsColumns: ColumnModel[];

  public praeparatColumns: ColumnModel[];
  public frequencyColumns: ColumnModel[];
  public combiColumns: ColumnModel[];
  public intervallColumns: ColumnModel[];
  public klasseColumns: ColumnModel[];
  public wirkstoffColumns: ColumnModel[];
  public devicetypColumns: ColumnModel[];

  constructor(private covidService: Covid19ApiService, private papa: Papa) {}

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
      "ExcelExport",
      "CsvExport",
      "PdfExport",
      "ColumnChooser", // grid: [showColumnChooser]= 'true' , column: [showInColumnChooser]='false'
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
    this.sortOptions = {
      columns: [{ field: "deathsPerPop", direction: "Descending" }]
    };
    // this.sortOptions = { columns: [{ field: 'deathsPerPop', direction: 'Ascending' }, { field: 'ShipCity', direction: 'Descending' }] };

    // <e-column headerText='confirmed' [columns]='confirmedColumns'></e-column>
    // <e-column headerText='deaths' [columns]='deathsColumns'></e-column>
    this.confirmedColumns = [
      {
        field: "confirmed",
        headerText: "total",
        format: "N0",
        width: 120,
        textAlign: "Right",
        minWidth: 10
      },
      {
        field: "confirmedPerPop",
        headerText: "perPop",
        width: 100,
        textAlign: "Right",
        minWidth: 10
      }
    ];

    this.deathsColumns = [
      {
        field: "daeths",
        headerText: "total",
        width: 100,
        minWidth: 10
      },
      {
        field: "deathsPerPop",
        headerText: "perPop",
        width: 120,
        minWidth: 10
      }
    ];

    //
    // Präparat		          1/2/3x	Intervall	  Klasse			            Wirkstoff		    Deviceart
    // Handelsname Device	  Typ	    12	24	    LAMA LABA SAMA SABA ICS	LAMA LABA ICS		pMDI	PDI	Respi,at
    // Mono  Duo Tripple
    // alt: https://stackblitz.com/edit/js-jdabp7?file=index.js

    this.praeparatColumns = [
      {
        field: "Handelsname",
        headerText: "Handelsname",
        width: 100,
        textAlign: "Right",
        minWidth: 10
      },
      {
        field: "Device",
        headerText: "Device",
        width: 90,
        textAlign: "Right",
        minWidth: 10
      },
      {
        field: "Firma",
        headerText: "Firma",
        width: 50,
        textAlign: "Right",
        minWidth: 10
      }
    ];
    this.frequencyColumns = [
      {
        field: "Typ",
        headerText: "Typ",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      }
    ];
    this.combiColumns = [
      {
        field: "Mono",
        headerText: "Mono",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      },
      {
        field: "Duo",
        headerText: "Duo",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      },
      {
        field: "Triple",
        headerText: "Triple",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      }
    ];
    this.intervallColumns = [
      {
        field: "12h",
        headerText: "12h",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      },
      {
        field: "24h",
        headerText: "24h",
        width: 30,
        textAlign: "Center",
        minWidth: 5,
        type: "boolean",
        displayAsCheckBox: "true"
      }
    ];
    this.klasseColumns = [
      {
        field: "LAMA",
        headerText: "LAMA",
        width: 30,
        textAlign: "Center",
        minWidth: 5,
        type: "boolean",
        displayAsCheckBox: "true"
      },
      {
        field: "LABA",
        headerText: "LABA",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      },
      {
        field: "SABA",
        headerText: "SABA",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      },
      {
        field: "SAMA",
        headerText: "SAMA",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      },
      {
        field: "ICS",
        headerText: "ICS",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      }
    ];
    this.wirkstoffColumns = [
      {
        field: "WirkstoffMA",
        headerText: "MA",
        width: 100,
        textAlign: "Center",
        minWidth: 10
      },
      {
        field: "WirkstoffBA",
        headerText: "BA",
        width: 100,
        textAlign: "Center",
        minWidth: 10
      },
      {
        field: "WirkstoffICS",
        headerText: "ICS",
        width: 100,
        textAlign: "Center",
        minWidth: 10
      }
    ];
    this.devicetypColumns = [
      {
        field: "pMDI",
        headerText: "pMDI",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      },
      {
        field: "PDI",
        headerText: "PDI",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      },
      {
        field: "Resp",
        headerText: "Resp",
        width: 30,
        textAlign: "Center",
        minWidth: 30,
        type: "boolean",
        displayAsCheckBox: "true"
      }
    ];

    console.log(populations[0]);
    console.log(cities[0]);
    console.log(csv1);

    this.covidService.getLatest().subscribe(response => {
      this.covidResults$ = response;
      this.covidResults = response.result;
      this.rebuild(response.result);
      // console.log(JSON.stringify(this.covidResults$));
      //console.log(this.covidResults);
    });

    this.covidService.getLatestGermany().subscribe(response => {
      this.de_latest = response.result;
    });

    // MAP

    /*     this.covidService.getByCountry('DEU').subscribe(response => {
      this.covidGermany = response.result;
      console.log(response.result);
    }); */

    this.parseCsv(csv1);
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
    if (args.item.id === "Grid_csvexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.csvExport();
    }
    if (args.item.id === "Grid_pdfexport") {
      // ToDo : import PDF module
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.pdfExport();
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
    this.grid.toolbarModule.enableItems(
      ["Grid_Collapse", "Grid_Expand"],
      false
    ); // Disable toolbar items.
  }

  Patient_Fallnummer: any;
  Patient_Vorname: any;
  Patient_Nachname: any;
  Patient_Aufnahmedatum: any;
  Patient_Medikation: any;
  Patient_TODO: any;
  Patient_Diagnosen: any;
  Patient_DiagnosenUnformatiert: any;
  Patient_Anamnese: any;
  Patient_Vorerkrankungen: any;
  Patient_Voroperationen: any;
  Patient_KoerperlicherUntersuchungsbefund: any;
  Patient_EKGBefund: any;
  Patient_BildgebungBefund: any;
  Patient_Procedere: any;
  Patient_Therapie: any;

  // csv
  parseCsv(csv: string) {
    this.papa.parse(csv1, {
      header: true,
      delimiter: ";",
      // newline	The newline sequence. Leave blank to auto-detect. Must be one of \r, \n, or \r\n.
      // quoteChar	The character used to quote fields. The quoting of all fields is not mandatory. Any field which is not quoted will correctly read.
      // escapeChar	The character used to escape the quote character within a field. If not set, this option will default to the value of quoteChar, meaning that the default escaping of quote character within a quoted field is using the quote character two times. (e.g. "column with ""quotes"" in text")

      complete: result => {
        console.log("Parsed: ", result);
        console.log(result.data);

        this.Patient_Fallnummer = result.data[0].Fallnummer;
        this.Patient_Vorname = result.data[0].Vorname;
        this.Patient_Nachname = result.data[0].Nachname;
        this.Patient_Aufnahmedatum = result.data[0].Anlegedatum;
        this.Patient_Medikation = result.data[0].Text;
        this.Patient_TODO = result.data[0].dosis;
        this.Patient_Diagnosen = result.data[0].Diagnose;
        this.Patient_DiagnosenUnformatiert = result.data[0].NoFormatDiagnose;
        this.Patient_Anamnese = result.data[0].txtanamnese;
        this.Patient_Vorerkrankungen = result.data[0].txtVorerkrankungen;
        this.Patient_Voroperationen = result.data[0].txtVoroperationen;
        this.Patient_KoerperlicherUntersuchungsbefund =
          result.data[0].txtbefund;
        this.Patient_EKGBefund = result.data[0].txtekg1;
        this.Patient_BildgebungBefund = result.data[0].txtr_ntgen;
        this.Patient_Procedere = result.data[0].txtprocedere;
        this.Patient_Therapie = result.data[0].txttherapie;

        console.log(this.Patient_Therapie);
        console.log(this.Patient_KoerperlicherUntersuchungsbefund);
      }
    });
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

/**

<ejs-tab>
  <e-tabitems>
    <e-tabitem>
      <ng-template #headerText>
        <div></div>
      </ng-template>
      <ng-template #content>
        
      </ng-template>
    </e-tabitem>
  </e-tabitems>
</ejs-tab>

<e-column field='OrderID' headerText='Order ID' textAlign='Right' width=90 format='C2'format='yMd' ></e-column>

<e-column field='' headerText='' textAlign='Right' width=90></e-column>

columnname
columnMinwWidth
columnMaxWidth
columnFormat
allowResize
allowGrouping
allowSorting
groupBy
groupByPosition
propertyType
displayLabelname
displayGridname
editorTypeGrid
editorTypeForm
widthGridColumn
widthForm
mask
isRequired
min
max
length
precision
defaultValue
aggregate
[showInColumnChooser]='false'


component	npm	dependencies	stylesheets	Module	services

 */


/**
 

var alle = document.getElementById("alle"); alle.onclick = function(){ clearFilters(); return false; };
var lama = document.getElementById("lama"); lama.onclick = function(){ setLamaFilter(); return false; };
 var laba = document.getElementById("laba"); laba.onclick = function(){ setLabaFilter(); return false; };
var ics = document.getElementById("ics"); ics.onclick = function(){ setIcsFilter(); return false; };
var mono = document.getElementById("mono"); mono.onclick = function(){ setMonoFilter(); return false; };
var duo = document.getElementById("duo"); duo.onclick = function(){ setDuoFilter(); return false; };
var triple = document.getElementById("triple"); triple.onclick = function(){ setTripleFilter(); return false; };
var kombi = document.getElementById("kombi"); kombi.onclick = function(){ setKombiFilter(); return false; };

var copda = document.getElementById("copda"); copda.onclick = function(){ setCopdIndication("copda");  return false; };
var copdb = document.getElementById("copdb"); copdb.onclick = function(){ setCopdIndication("copdb"); return false; };
var copdc = document.getElementById("copdc"); copdc.onclick = function(){ setCopdIndication("copdc"); return false; };
var copdd = document.getElementById("copdd"); copdd.onclick = function(){ setCopdIndication("copdd"); return false; };

var alletypen = document.getElementById("alletypen"); alletypen.onclick = function(){ setDeviceFilter("alletypen"); return false; };
var pmdi = document.getElementById("pmdi"); pmdi.onclick = function(){ setDeviceFilter("pmdi"); return false; };
var dpi = document.getElementById("dpi"); dpi.onclick = function(){ setDeviceFilter("dpi"); return false; };
var respimat = document.getElementById("respimat"); respimat.onclick = function(){ setDeviceFilter("respimat"); return false; };

var lastActiveItem;
function classToggle (element){
  document.getElementById(element).classList.toggle("active");
  //element.classList.toggle("active");
}

function markElementAsActive(){
          var current = document.getElementsByClassName("active");
        // If there's no active class
        if (current.length > 0) { 
          current[0].className = current[0].className.replace(" active", "");
        }
        // Add the active class to the current/clicked button
        this.className += " active";
}

function markElementsAsActive(){
    // Get the container element
    var linkContainer = document.getElementById("filterTable");

    // Get all links with class="link" inside the container
    var links = linkContainer.getElementsByClassName("link");

    // Loop through the links and add the active class to the current/clicked button
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");

        // If there's no active class
        if (current.length > 0) { 
          current[0].className = current[0].className.replace(" active", "");
        }

        // Add the active class to the current/clicked button
        this.className += " active";
      });
}

}

function clearFilters(){
  table2.clearFilter();
}

function setFilter (){
  table2.setFilter("age", ">", 10);
}

function setLamaFilter(){
  table2.clearFilter();
  table2.setFilter("LAMA", "=", 1);
}

function setLabaFilter(){
  table2.clearFilter();
  table2.setFilter("LABA", "=", 1);
}

function setIcsFilter(){
  table2.clearFilter();
  table2.setFilter("ICS", "=", 1);
}

function setMonoFilter(){
  table2.clearFilter();
  table2.setFilter("Typ", "=", 1);
  // table2.setFilter("Mono", "=", 1);
}

function setDuoFilter(){
  table2.clearFilter();
  table2.setFilter("Typ", "=", 2);
  //table2.setFilter("Duo", "=", 1);
}

function setTripleFilter(){
  table2.clearFilter();
  table2.setFilter("Typ", "=", 3);
  // table2.setFilter("Triple", "=", 1);
}

function setKombiFilter(){
  table2.clearFilter();
  table2.setFilter("Typ", ">=", 2);
}

function setDeviceFilter(devicetype){
  switch (devicetype){    
    case "alletypen":
          table2.clearFilter();
    break;
        case "pmdi":
          table2.clearFilter();
          table2.setFilter("pMDI", "=", 1);
          break;
        case "dpi":
          table2.clearFilter();
          table2.setFilter("PDI", "=", 1);
         break;
        case "respimat":
          table2.clearFilter();
          table2.setFilter("Resp", "=", 1);
          break;
  }
}


function setCopdIndication(stadium){
  switch (stadium){
    case "copda": 
      table2.clearFilter();
      // keine, SABA, SABA + SAMA
      table2.setFilter([
        [
          {field:"SABA",type:"=",value:"1"},
          {field:"SAMA",type:"=",value:"1"}
        ]
      ]);
      break;
    case "copdb": 
      table2.clearFilter();
      // LABA, LAMA, LABA+LAMA
      table2.setFilter([
        [
          {field:"LABA",type:"=",value:"1"},
          {field:"LAMA",type:"=",value:"1"}
        ]
      ]);      
      break;
    case "copdc": 
      table2.clearFilter();
      // LAMA o. LAMA + LABA
      table2.setFilter([
        [
          {field:"LABA",type:"=",value:"1"},
          {field:"LAMA",type:"=",value:"1"}
        ]
      ]);       
      break;
    case "copdd": 
      table2.clearFilter();
      // LAMA+LABA,LABA+ICS, LAMA+LABA+ICS
      break;                  
  }
}

 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


export class Country {
    public name: string;
    public flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class Covid19ApiService {
  endpoint: string = "https://restcountries.eu/rest/v2/name/";

  // https://covidapi.info/api/v1/country/' + value + '/latest
  // https://covidapi.info/api/v1/country/' + yourCountry + '/timeseries/' + startDate + '/' + endDate

  constructor(private http: HttpClient) { }

  searchCountry(term: string): Observable<Country[]> {
    let url = `${this.endpoint}${term}`;
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(this.handleError<Country[]>('countries', []))
      )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`failed: ${error.message}`);
      return of(result as T);
    };
  }

  getLatest(): Observable<any> {
    const endpoint: string = 'https://covidapi.info/api/v1/global/latest';
    return this.http.get(endpoint)
      .pipe((response) => response);

  }

  getLatestGermany(): Observable<any> {
    const endpoint: string = 'https://covidapi.info/api/v1/country/DEU/latest';
    return this.http.get(endpoint)
      .pipe((response => response));
  }

  getLatestAndDayeforeGermany(): Observable<any> {
    const endpoint: string = '';
    return this.http.get(endpoint)
      .pipe (response => response);
  }

  getDateRangeGermany(): Observable<any> {
    const endpoint: string = '';
    return this.http.get(endpoint)
      .pipe(result => result);
  }

  getLatestByCountry(countryIso3:string): Observable<any> {
    const endpoint: string = `https://covidapi.info/api/v1/country/${countryIso3}/latest`;
    return this.http.get(endpoint)
      .pipe(result => result);
  }

  getByCountryAndDateRange(countryIso3:string, startDate: Date, endDate: Date): Observable<any> {
    const endpoint: string = `https://covidapi.info/api/v1/country/${countryIso3}/timeseries/${startDate}/${endDate}`;
    return this.http.get(endpoint)
      .pipe(result => result);
  }

}

// https://stackoverflow.com/questions/16253060/how-to-convert-country-names-to-iso-3166-1-alpha-2-values-using-python
// https://github.com/ecrmnn/iso-3166-1
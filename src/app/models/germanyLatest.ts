// {"count":1,"result":{"2020-08-10":{"confirmed":218508,"deaths":9203,"recovered":197382}}}

export interface Response {
  count: number;
  result: Result;
}
export interface Result {
  map: Map<Date,Item>;
}
export interface Item {
  confirmed: number;
  deaths: number;
  recovered: number;
}


// https://www.google.com/search?q=map+api+response+to+typescript+class&oq=map+api+response+to+typescript+class
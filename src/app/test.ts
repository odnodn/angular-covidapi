
class KeyValue<T1, T2> {
    private key: T1;
    private value: T2;

    constructor(key: T1, value: T2) {
        this.key = key;
        this.value = value;
    }

    getKey() {
        return this.key;
    }

    getValue() {
        return this.value;
    }
}

type KeyValuePair<K extends string | number, V = unknown> = [K, V]
const kv: KeyValuePair<string, string> = ["key", "value"]

// ts 4.0
// type KeyValuePairNamed = [key: string, value: string] // add `key` and `value` labels
// const [key, val]: KeyValuePairNamed = ["key", "val"] // array destructuring for convenience

// Stationäre Aufnahme
let columnMatchings: Map<string, string> = new Map([
  ['Fallnummer',        'Patient_Fallnummer'],
  ['Vorname',           'Patient_Vorname'],
  ['Nachname',          'Patient_Nachname'],
  ['Anlegedatum',       'Patient_Aufnahmedatum'],
  ['Text',              'Patient_Medikation'],
  ['dosis',             'Patient_TODO'],
  ['Diagnose',          'Patient_Diagnosen'],
  ['NoFormatDiagnose',  'Patient_DiagnosenUnformatiert'],
  ['txtanamnese',       'Patient_Anamnese'],
  ['txtVorerkrankungen','Patient_Vorerkrankungen'],
  ['txtVoroperationen', 'Patient_Voroperationen'],
  ['txtBefund',         'Patient_KoerperlicherUntersuchungsbefund'],
  ['txtekg1',           'Patient_EKGBefund'],
  ['txtr_ntgen',        'Patient_BildgebungBefund'],
  ['txtprocedere',      'Patient_Procedere'],
  ['txttherapie',       'Patient_Therapie'],
]);

function getTextFragment(textFragmentTitle:string): string {
  this.columnMatchings
}

// Vitalparamter
/**
Hf
RR
T
AF

 */

// Arztbrief
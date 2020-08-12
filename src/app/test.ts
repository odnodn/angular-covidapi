
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

/* type KeyValuePair<K extends string | number, V = unknown> = [K, V]
const kv: KeyValuePair<string, string> = [key, value] */

// ts 4.0
// type KeyValuePairNamed = [key: string, value: string] // add `key` and `value` labels
// const [key, val]: KeyValuePairNamed = [key, val] // array destructuring for convenience

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
  // this.columnMatchings
  return '';
}

// Vitalparamter
/**
Hf
RR
T
AF

 */

// Arztbrief

export const csv1:string = 
`Fallnummer;Vorname;Nachname;Anlegedatum;Text;dosis;Diagnose;NoFormatDiagnose;txtanamnese;txtVorerkrankungen;txtVoroperationen;txtbefund;txtekg1;txtr_ntgen;txtprocedere;txttherapie
"100053818";"Vorname";"Nachname";"07.08.2020";"Keine Dauermedikation";"";"* J18.9 Sepsis bei Pneumonie bds. G
* Akutes Nierenversagen a.e. prärenaler Genese bei Exsikkose
* Hyponatriämie 
* Bakteriurie";"* J18.9 Sepsis bei Pneumonie bds. G* Akutes Nierenversagen a.e. prärenaler Genese bei Exsikkose* Hyponatriämie * Bakteriurie";"Herr XX wird in Begleitung des Rettungsdienstes in unsere Notaufnahme eingeliefert. Dieser wurde von Passanten informiert, da der Patient in reduziertem Allgemeinzustand auf dem Bürgersteig liegend vorgefunden wurde. Bei Eintreffen in der Notaufnahme Temperatur 39,2°C, hypoton, q-SOFA 2 (AF ~ 30, Vigilanzminderung). Laut Patient fühle er sich seit ca. einer Woche zunehmend schwächer habe Husten mit gelblichem Auswurf und Thoraxschmerzen beim husten. ";"* Z.n. Apoplex 2012";"";"Patient in reduziertem AZ und kachektischem EZ, wach, ansprechbar, orientiert. Haut und Schleimhäute trocken, keine Ödeme, kein Ikterus
Pulmo: vermindertes AG links, Rasselgeräusche rechts
Cor: Herztöne rein, rhythmisch. 
Abdomen: Bauchdecke weich, kein Druckschmerz, keine Resistenzen tastbar, regelrechte Peristaltik. Nierenlager kein Klopfschmerz. 
Extremitäten altersentsprechende Beweglichkeit. 
Neurologischer Befund: keine groben neurologischen Defizite, Pupillen isokor und konsensuell lichtreagibel ";"Niedervoltage, Sinustachykardie 123 bpm, SI QIII-Typ, gelegentliche ventrikuläre Extrasystolen";"Thorax: Beurteilung: Massive Infiltrate mutmaßlich mit Teilatelektase der linken Lunge. Geringe Infiltrate im rechten Oberlappen nicht ausgeschlossen. Erheblich allseits vergrößertes Herz im Sinne einer globalen Insuffizienz. Keine Ergussbildung. Voraufnahme lag nicht vor. Kurzfristige Kontrolle empfohlen.";"U+B
Arterieller Zugang, EKG, Labor, Röntgen, BGA";"2 Paar BKs
2000 ml Jonosteril 
3 g Unacid i.v.
500 mg Klacid i.v. 
1 g Perfalgan i.v."`

export const csv2:string = 
`Fallnummer;Vorname;Nachname;Anlegedatum;Text;dosis;Diagnose;NoFormatDiagnose;txtanamnese;txtVorerkrankungen;txtVoroperationen;txtbefund;txtekg1;txtr_ntgen;txtprocedere;txttherapie
100053818;Vorname;Nachname;07.08.2020;Keine Dauermedikation;;* J18.9 Sepsis bei Pneumonie bds. G
* Akutes Nierenversagen a.e. prärenaler Genese bei Exsikkose
* Hyponatriämie 
* Bakteriurie;* J18.9 Sepsis bei Pneumonie bds. G* Akutes Nierenversagen a.e. prärenaler Genese bei Exsikkose* Hyponatriämie * Bakteriurie;Herr XX wird in Begleitung des Rettungsdienstes in unsere Notaufnahme eingeliefert. Dieser wurde von Passanten informiert, da der Patient in reduziertem Allgemeinzustand auf dem Bürgersteig liegend vorgefunden wurde. Bei Eintreffen in der Notaufnahme Temperatur 39,2°C, hypoton, q-SOFA 2 (AF ~ 30, Vigilanzminderung). Laut Patient fühle er sich seit ca. einer Woche zunehmend schwächer habe Husten mit gelblichem Auswurf und Thoraxschmerzen beim husten. ;* Z.n. Apoplex 2012;;Patient in reduziertem AZ und kachektischem EZ, wach, ansprechbar, orientiert. Haut und Schleimhäute trocken, keine Ödeme, kein Ikterus
Pulmo: vermindertes AG links, Rasselgeräusche rechts
Cor: Herztöne rein, rhythmisch. 
Abdomen: Bauchdecke weich, kein Druckschmerz, keine Resistenzen tastbar, regelrechte Peristaltik. Nierenlager kein Klopfschmerz. 
Extremitäten altersentsprechende Beweglichkeit. 
Neurologischer Befund: keine groben neurologischen Defizite, Pupillen isokor und konsensuell lichtreagibel ;Niedervoltage, Sinustachykardie 123 bpm, SI QIII-Typ, gelegentliche ventrikuläre Extrasystolen;Thorax: Beurteilung: Massive Infiltrate mutmaßlich mit Teilatelektase der linken Lunge. Geringe Infiltrate im rechten Oberlappen nicht ausgeschlossen. Erheblich allseits vergrößertes Herz im Sinne einer globalen Insuffizienz. Keine Ergussbildung. Voraufnahme lag nicht vor. Kurzfristige Kontrolle empfohlen.;U+B
Arterieller Zugang, EKG, Labor, Röntgen, BGA;2 Paar BKs
2000 ml Jonosteril 
3 g Unacid i.v.
500 mg Klacid i.v. 
1 g Perfalgan i.v.`
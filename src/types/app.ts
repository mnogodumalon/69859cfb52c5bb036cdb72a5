// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Busse {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    fahrzeugnummer?: string;
    kennzeichen?: string;
    hersteller?: string;
    modell?: string;
    baujahr?: number;
    fahrgestellnummer?: string;
    kilometerstand?: number;
    anschaffungsdatum?: string; // Format: YYYY-MM-DD oder ISO String
    status?: 'in_betrieb' | 'in_wartung' | 'ausser_betrieb' | 'reserve';
    ms_bc_referenz?: string;
    notizen?: string;
  };
}

export interface Wartungstypen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    bezeichnung?: string;
    beschreibung?: string;
    kategorie?: 'routine' | 'inspektion' | 'reparatur' | 'gesetzlich' | 'sicherheit';
    intervall_km?: number;
    intervall_tage?: number;
    geschaetzte_dauer?: number;
    geschaetzte_kosten?: number;
  };
}

export interface Wartungsplanung {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    bus?: string; // applookup -> URL zu 'Busse' Record
    wartungstypen?: string; // applookup -> URL zu 'Wartungstypen' Record
    geplantes_datum?: string; // Format: YYYY-MM-DD oder ISO String
    aktueller_km_stand?: number;
    prioritaet?: 'normal' | 'hoch' | 'dringend' | 'niedrig';
    planungsstatus?: 'geplant' | 'bestaetigt' | 'in_bearbeitung' | 'abgeschlossen' | 'verschoben';
    planungsnotizen?: string;
  };
}

export interface Wartungsdurchfuehrung {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    bus?: string; // applookup -> URL zu 'Busse' Record
    wartungstypen?: string; // applookup -> URL zu 'Wartungstypen' Record
    durchfuehrungsdatum?: string; // Format: YYYY-MM-DD oder ISO String
    km_stand_bei_wartung?: number;
    durchgefuehrte_arbeiten?: string;
    verwendete_teile?: string;
    techniker_vorname?: string;
    techniker_nachname?: string;
    arbeitszeit_stunden?: number;
    gesamtkosten?: number;
    naechste_wartung_km?: number;
    naechste_wartung_datum?: string; // Format: YYYY-MM-DD oder ISO String
    ms_bc_belegnummer?: string;
    durchfuehrungsnotizen?: string;
  };
}

export const APP_IDS = {
  BUSSE: '69859cb732543c57f5582054',
  WARTUNGSTYPEN: '69859cbc8803d48c36b2982c',
  WARTUNGSPLANUNG: '69859cbdb46adb45561f8e7f',
  WARTUNGSDURCHFUEHRUNG: '69859cbddb8910ee0e4d15e5',
} as const;

// Helper Types for creating new records
export type CreateBusse = Busse['fields'];
export type CreateWartungstypen = Wartungstypen['fields'];
export type CreateWartungsplanung = Wartungsplanung['fields'];
export type CreateWartungsdurchfuehrung = Wartungsdurchfuehrung['fields'];
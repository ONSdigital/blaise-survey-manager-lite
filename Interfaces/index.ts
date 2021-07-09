interface ApiInstrument {
    activeToday: boolean;
    installDate: string;
    name: string;
    serverParkName: string;
}

interface Instrument {
    installDate: string
    name: string
    serverParkName: string
    activeToday: boolean
    link: string
    fieldPeriod: string
    surveyTLA: string
}

interface Survey {
    instruments: Instrument[]
    survey: string
}

export type {ApiInstrument, Instrument, Survey};

import {ApiInstrument, Instrument, Survey} from "../../../Interfaces";
export class InstrumentHelper {

    public static apiInstrument(name :string, activeToday : boolean) : ApiInstrument {
        const apiInstrument : ApiInstrument =
                {
                    activeToday: activeToday,
                    installDate: "2020-12-11T11:53:55.5612856+00:00",
                    name: name,
                    serverParkName: "LocalDevelopment",
                };

        return apiInstrument;
    }

    public static instrument(name :string, activeToday : boolean, fieldPeriod: string, surveyType :string, link: string) : Instrument {
        const instrument : Instrument =
                {
                    activeToday: activeToday,
                    fieldPeriod: fieldPeriod,
                    installDate: "2020-12-11T11:53:55.5612856+00:00",
                    link: link,
                    name: name,
                    serverParkName: "LocalDevelopment",
                    "surveyTLA": surveyType
                };

        return instrument;
    }
}

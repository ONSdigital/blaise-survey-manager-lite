import {Response} from "express";
import {Instrument, Survey} from "../../Interfaces";
import axios, {AxiosResponse} from "axios";
import {chain, filter} from "lodash";
import Functions from "../Functions";

interface InstrumentResponse extends AxiosResponse {
    data: Instrument[]
}

export default function GetAllActiveInstruments(res: Response, BLAISE_API_URL: string, VM_EXTERNAL_WEB_URL: string): void {
    console.log("Retrieve list of instruments");

    axios.get(`http://${BLAISE_API_URL}/api/v1/cati/instruments`)
        .then(function ({data}: InstrumentResponse) {
            // Add interviewing link and date of instrument to array objects
            data.map((instrument: Instrument) => {
                const {name}: Instrument = instrument;
                instrument.surveyTLA = name.substr(0, 3);
                instrument.link = `https://${VM_EXTERNAL_WEB_URL}/${name}?LayoutSet=CATI-Interviewer_Large`;
                instrument.fieldPeriod = Functions.field_period_to_text(name);
            });

            // Filter the instruments by activeToday filed
            const filteredInstruments = filter(data, (instrument: Instrument) => instrument.activeToday === true);

            console.log(`Retrieved instrument list, ${data.length} item/s, active instrument ${filteredInstruments.length} item/s`);

            const surveys: Survey[] = chain(filteredInstruments)
                // Group the elements of Array based on `surveyTLA` property
                .groupBy("surveyTLA")
                // `key` is group's name (surveyTLA), `value` is the array of objects
                .map((value: Instrument[], key: string) => ({survey: key, instruments: value}))
                .value();
            return res.json(surveys);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve instrument list");
            console.error(error);
            return res.status(500).json(error);
        });
}


import express, {Request, response, Response, Router} from "express";
import {Instrument, Survey} from "../../Interfaces";
import axios, {AxiosResponse} from "axios";
import _ from "lodash";
import Functions from "../Functions";
import AuthProvider from "../AuthProvider";

export default function InstrumentRouter(
    BLAISE_API_URL: string, 
    VM_EXTERNAL_WEB_URL: string, 
    BIMS_CLIENT_ID: string,
    BIMS_API_URL:string):
    Router {
    "use strict";
    const instrumentRouter = express.Router();
    const authProvider = new AuthProvider(BIMS_CLIENT_ID);

    // An api endpoint that returns list of installed instruments
    instrumentRouter.get("/instruments", (req: Request, res: Response) => {
        console.log("get list of items");

        async function getToStartDate(instrument: Instrument) {
            let telOpsStartDate;
            const authHeader = await authProvider.getAuthHeader();
            return axios.get(
                `${BIMS_API_URL}/tostartdate/${instrument.name}`,
                {headers: authHeader,
                    validateStatus: function (status) { return status >= 200;} })
            .then(function (response: AxiosResponse) {

                console.log(`The BIMS request responded with a status of ${response.status} and a body of ${response.data}`);

                return response.status == 200 && response.headers["content-type"] == "application/json" ? response.data.tostartdate : null;
            });
        }

        async function activeToday(instrument: Instrument) {
            const telOpsStartDate = await getToStartDate(instrument);

            if(telOpsStartDate == null || Date.parse(telOpsStartDate) <= Date.now())
            {
                console.log(`the instrument ${instrument.name} is live for TO (TO start date = ${telOpsStartDate == null ? "Not set" : telOpsStartDate}) (Active today = ${instrument.activeToday})`);
                return instrument.activeToday;
            }
            console.log(`the instrument ${instrument.name} is not currently live for TO (TO start date = ${telOpsStartDate == null ? "Not set" : telOpsStartDate}) (Active today = ${instrument.activeToday})`);
            return false;
        }

        axios.get("http://" + BLAISE_API_URL + "/api/v1/cati/instruments")
            .then(async function (response: AxiosResponse) {
                const allInstruments: Instrument[] = response.data;
                const activeInstruments: Instrument[] = [];
                // Add interviewing link and date of instrument to array objects
                await Promise.all(allInstruments.map(async function (instrument: Instrument) {
                    const active = await activeToday(instrument);
                    console.log(`Active today outputted (${active}) for instrument (${instrument.name}) type of (${typeof active})`);
                    if (active)
                    {
                        instrument.surveyTLA = instrument.name.substr(0, 3);
                        instrument.link = "https://" + VM_EXTERNAL_WEB_URL + "/" + instrument.name + "?LayoutSet=CATI-Interviewer_Large";
                        instrument.fieldPeriod = Functions.field_period_to_text(instrument.name);
                        activeInstruments.push(instrument);
                    }                
                }));
                
                console.log("Retrieved active instruments, " + activeInstruments.length + " item/s");

                const surveys: Survey[] = _.chain(activeInstruments)
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
    });

    return instrumentRouter;
}


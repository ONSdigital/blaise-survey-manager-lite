/**
 * @jest-environment node
 */
import app from "../server"; // Link to your server file
import supertest from "supertest";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
require("jest-extended");

const request = supertest(app);

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios, {onNoMatch: "throwException"});

// Mock any GET request to /api/instruments
// arguments for reply are (status, data, headers)


describe("Given the API returns 2 instruments with only one that is active", () => {
    beforeAll(() => {
        mock.onGet("http://" + process.env.BLAISE_API_URL + "/api/v1/cati/instruments").reply(200,
            apiInstrumentList,
        );
        const liveDateUrl = new RegExp(`${process.env.BIMS_API_URL}/tostartdate/.*`);
        mock.onGet(liveDateUrl).reply(200,
            {tostartdate: null},
            {"content-type": "application/json"}
        );
    });

    const apiInstrumentList = [
        InstrumentHelper.apiInstrument("OPN2007T", true),
        InstrumentHelper.apiInstrument("OPN2004A", false)];

    const instrumentListReturned = [
        {
            survey: "OPN",
            instruments: [InstrumentHelper.instrument("OPN2007T", true, "July 2020", "OPN", "https://external-web-url/OPN2007T?LayoutSet=CATI-Interviewer_Large")]
        }
    ];

    it("should return a 200 status and a list with the one active instrument", async done => {
        const response = await request.get("/api/instruments");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].instruments).toHaveLength(1);
        expect(response.body).toIncludeSameMembers(instrumentListReturned);
        done();
    });

    afterAll(() => {
        mock.reset();
    });
});

describe("Given the API returns 2 active instruments for the survey OPN", () => {
    beforeAll(() => {
        mock.onGet("http://" + process.env.BLAISE_API_URL + "/api/v1/cati/instruments").reply(200,
            apiInstrumentList,
        );
        const liveDateUrl = new RegExp(`${process.env.BIMS_API_URL}/tostartdate/.*`);
        mock.onGet(liveDateUrl).reply(200,
            {tostartdate: null},
            {"content-type": "application/json"}
        );   
    });

    const apiInstrumentList = [
          InstrumentHelper.apiInstrument("OPN2007T", true),
          InstrumentHelper.apiInstrument("OPN2004A", true)];

    const instrumentListReturned = [
        {
            survey: "OPN",
            instruments: [
                InstrumentHelper.instrument("OPN2007T", true, "July 2020", "OPN", "https://external-web-url/OPN2007T?LayoutSet=CATI-Interviewer_Large"),
                InstrumentHelper.instrument("OPN2004A", true, "April 2020", "OPN", "https://external-web-url/OPN2004A?LayoutSet=CATI-Interviewer_Large")]
        }
    ];

    it("should return a list with one survey with 2 instrument objects", async done => {
        const response = await request.get("/api/instruments");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(1);

        expect(response.body[0].instruments).toHaveLength(2);
        expect(response.body[0].survey).toEqual(instrumentListReturned[0].survey);
        expect(response.body[0].instruments).toIncludeSameMembers(instrumentListReturned[0].instruments);
        done();
    });

    afterAll(() => {
        mock.reset();
    });
});

describe("Given the API returns 2 active instruments for 2 separate surveys ", () => {
    beforeAll(() => {
        mock.onGet("http://" + process.env.BLAISE_API_URL + "/api/v1/cati/instruments").reply(200,
            apiInstrumentList,
        );
        const liveDateUrl = new RegExp(`${process.env.BIMS_API_URL}/tostartdate/.*`);
        mock.onGet(liveDateUrl).reply(200, 
            {tostartdate: null},
            {"content-type": "application/json"}
        );
    });

    const apiInstrumentList = [
          InstrumentHelper.apiInstrument("IPS2007T", true),
          InstrumentHelper.apiInstrument("OPN2004A", true)];

    const instrumentListReturned = [
    {
        survey: "IPS",
        instruments: [InstrumentHelper.instrument("IPS2007T", true, "Field period unknown","IPS", "https://external-web-url/IPS2007T?LayoutSet=CATI-Interviewer_Large")]
    },
    {
        survey: "OPN",
        instruments: [InstrumentHelper.instrument("OPN2004A", true, "April 2020","OPN", "https://external-web-url/OPN2004A?LayoutSet=CATI-Interviewer_Large")]
    }];

    it("should return a list with 2 surveys with instrument object in each", async done => {
        const response = await request.get("/api/instruments");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(2);

        expect(response.body[0].instruments).toHaveLength(1);
        expect(response.body[1].instruments).toHaveLength(1);
        expect(response.body).toIncludeSameMembers(instrumentListReturned);
        done();
    });

    afterAll(() => {
        mock.reset();
    });
});


describe("Get list of instruments endpoint fails", () => {
    beforeAll(() => {
        mock.onGet("http://" + process.env.BLAISE_API_URL + "/api/v1/cati/instruments").networkError();
        const liveDateUrl = new RegExp(`${process.env.BIMS_API_URL}/tostartdate/.*`);
        mock.onGet(liveDateUrl).reply(200, 
            {tostartdate: null},
            {"content-type": "application/json"}
        );
    });

    it("should return a 500 status and an error message", async done => {
        const response = await request.get("/api/instruments");

        expect(response.statusCode).toEqual(500);
        expect(JSON.stringify(response.body)).toMatch(/(Network Error)/i);
        done();
    });

    afterAll(() => {
        mock.reset();
    });
});


import {defineFeature, loadFeature} from "jest-cucumber";
import {IsoDateHelper} from "./helpers/iso-date-helper";
import {InstrumentHelper} from "./helpers/instrument-helper";

const feature = loadFeature("./src/features/TO_Interviewer_Happy_Path.feature", {tagFilter: "@server"});

defineFeature(feature, test => {

    //Scenario 3b
    let response;
    const liveDateUrl = new RegExp(`${process.env.BIMS_API_URL}/tostartdate/.*`);
    const instrumentName = "OPN2007T";

    const questionnaireHasATelOpsStartDateOfToday = (given) => {
     given("a survey questionnaire has a TelOps start date of today", async () => {
            mock.onGet(liveDateUrl).reply(200,{tostartdate: IsoDateHelper.today()}, {"content-type": "application/json"});
        });
    };

    const questionnaireHasATelOpsStartDateInThePast = (given) => {
     given("a survey questionnaire has a TelOps start date in the past", async () => {
            mock.onGet(liveDateUrl).reply(200,{tostartdate: IsoDateHelper.yesterday()}, {"content-type": "application/json"});
        });
    };

    const questionnaireHasATelOpsStartDateInTheFuture = (given) => {
     given("a survey questionnaire has a TelOps start date is in the future", async () => {
            mock.onGet(liveDateUrl).reply(200,{tostartdate: IsoDateHelper.tomorrow()}, {"content-type": "application/json"});
        });
    };

    const questionnaireDoesNotHaveATelOpsStartDate = (given) => {
     given("a survey questionnaire does not have a TelOps start date", async () => {
            mock.onGet(liveDateUrl).reply(404,null, {"content-type": "application/json"});}
            );
        };

    const questionnaireHasAnActiveSurveyDay = (given) => {
        given("an active survey day", async () => {
            const apiInstrumentList = [InstrumentHelper.apiInstrument(instrumentName, true)];

            mock.onGet("http://" + process.env.BLAISE_API_URL + "/api/v1/cati/instruments").reply(200,
                 apiInstrumentList);
        });
    };

    const questionnaireDoesNotHaveAnActiveSurveyDay = (given) => {
        given("does not have an active survey day", async () => {
            const apiInstrumentList = [InstrumentHelper.apiInstrument(instrumentName, false)];

            mock.onGet("http://" + process.env.BLAISE_API_URL + "/api/v1/cati/instruments").reply(200,
                apiInstrumentList);
        });
    };

    const iSelectTheSurveyIAmWorkingOn = (when) => {
        when("I select the survey I am working on", async () => {
            response = await request.get("/api/instruments");
        });
    };

    const thenIWillSeeTheQuestionnaireListed = (then) => {
        then("I will see that questionnaire listed for the survey", () => {
            // The survey is returned
            let selectedSurvey = response.body[0].instruments;
            expect(selectedSurvey).toHaveLength(1);

            const instrumentListReturned = [InstrumentHelper.instrument(instrumentName, true, "July 2020","OPN", "https://external-web-url/OPN2007T?LayoutSet=CATI-Interviewer_Large")];

            expect(selectedSurvey).toEqual(instrumentListReturned);
        });
    };

    const thenIWillNotSeeTheQuestionnaireListed = (then) => {
        then("I will not see that questionnaire listed for the survey", () => {
            // The questionnaire is not returned
            expect(response.body).toHaveLength(0);
        });
    };

    test("Show surveys that have a TelOps start date of today and an active survey day in TOBI", ({given, and, when, then}) => {
        questionnaireHasATelOpsStartDateOfToday(given);
        questionnaireHasAnActiveSurveyDay(and);
        iSelectTheSurveyIAmWorkingOn(when);
        thenIWillSeeTheQuestionnaireListed(then);
    });

    test("Show surveys that have a TelOps start date in the past and an active survey day in TOBI", ({given, and, when, then}) => {
        questionnaireHasATelOpsStartDateInThePast(given);
        questionnaireHasAnActiveSurveyDay(and);
        iSelectTheSurveyIAmWorkingOn(when);
        thenIWillSeeTheQuestionnaireListed(then);
    });

    test("Do not show surveys that have an active survey day but TelOps start date in the future in TOBI", ({given, and, when, then}) => {
        questionnaireHasATelOpsStartDateInTheFuture(given);
        questionnaireHasAnActiveSurveyDay(and);
        iSelectTheSurveyIAmWorkingOn(when);
        thenIWillNotSeeTheQuestionnaireListed(then);
    });

    test("Do not show surveys that have a TelOps start date in the past but no active survey day in TOBI", ({given, and, when, then}) => {
        questionnaireHasATelOpsStartDateInThePast(given);
        questionnaireDoesNotHaveAnActiveSurveyDay(and);
        iSelectTheSurveyIAmWorkingOn(when);
        thenIWillNotSeeTheQuestionnaireListed(then);
    });

    test("Show surveys that do not have a TelOps start date but have an active survey day in TOBI", ({given, and, when, then}) => {
        questionnaireDoesNotHaveATelOpsStartDate(given);
        questionnaireHasAnActiveSurveyDay(and);
        iSelectTheSurveyIAmWorkingOn(when);
        thenIWillSeeTheQuestionnaireListed(then);
    });

    test("Do not show surveys that do not have a TelOps start date and do not have an active survey day in TOBI", ({given, and, when, then}) => {
        questionnaireDoesNotHaveATelOpsStartDate(given);
        questionnaireDoesNotHaveAnActiveSurveyDay(and);
        iSelectTheSurveyIAmWorkingOn(when);
        thenIWillNotSeeTheQuestionnaireListed(then);
    });
});

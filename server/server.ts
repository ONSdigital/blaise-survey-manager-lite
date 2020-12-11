import Functions from "./Functions";
import express, {NextFunction, Request, Response} from "express";
import axios, {AxiosResponse} from "axios";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";

const server = express();

axios.defaults.timeout = 10000;

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

interface Instrument {
    installDate: string
    name: string
    serverParkName: string
    activeToday: boolean
    surveyDays: string[]
    link: string
    date: string
}

// where ever the react built package is
const buildFolder = "../build";

// load the .env variables in the server
const {VM_EXTERNAL_CLIENT_URL, VM_EXTERNAL_WEB_URL, BLAISE_API_URL, VM_INTERNAL_URL} = process.env;
const CATI_DASHBOARD_URL = "https://" + VM_EXTERNAL_WEB_URL + "/Blaise";

// treat the index.html as a template and substitute the value
// at runtime
server.set("views", path.join(__dirname, buildFolder));
server.engine("html", ejs.renderFile);
server.use(
    "/static",
    express.static(path.join(__dirname, `${buildFolder}/static`)),
);



// An api endpoint that returns list of installed instruments
server.get("/api/instruments", (req: Request, res: Response) => {
    console.log("get list of items");

    function activeDay(instrument: Instrument) {
        return instrument.activeToday === true;
    }

    axios.get("http://" + BLAISE_API_URL + "/api/v1/cati/instruments")
        .then(function (response: AxiosResponse) {
            let instruments: Instrument[] = response.data;
            // Add interviewing link and date of instrument to array objects
            instruments.forEach(function (element: Instrument) {
                element.link = "https://" + VM_EXTERNAL_WEB_URL + "/" + element.name + "?LayoutSet=CATI-Interviewer_Large";
                element.date = Functions.field_period_to_text(element.name);
            });
            console.log(instruments)
            instruments = instruments.filter(activeDay);
            console.log(instruments)
            console.log("Retrieved instrument list, " + instruments.length + " item/s");
            return res.json(instruments);
        })
        .catch(function (error) {
            // handle error
            console.error("Failed to retrieve instrument list");
            console.error(error);
            return res.status(500).json(error);
        });
});

// Health Check endpoint
server.get("/health_check", async function (req: Request, res: Response) {
    console.log("Heath Check endpoint called");
    res.status(200).json({status: 200});
});

server.get("*", function (req: Request, res: Response) {
    res.render("index.html", {
        VM_EXTERNAL_CLIENT_URL, CATI_DASHBOARD_URL
    });
});

server.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.render("../views/500.html", {});
});
export default server;

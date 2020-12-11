import ExternalLink from "./ONSDesignSystem/ExternalLink";
import React, {ReactElement} from "react";
import {Link, useParams} from "react-router-dom";
import {Instrument, Survey} from "../../Interfaces";


interface listError {
    error: boolean,
    message: string
}

interface Props {
    list: Survey[],
    listError: listError
}

interface Params {
    survey: string
}

function InstrumentList(props: Props): ReactElement {
    const {list, listError}: Props = props;
    const {survey}: Params = useParams();

    const filteredSurvey: Survey[] = list.filter((obj: Survey) => {
        return obj.survey === survey;
    });

    let surveyInstruments: Instrument[] = [];
    if (filteredSurvey.length === 1) {
        surveyInstruments = filteredSurvey[0].instruments;
    } else if (filteredSurvey.length !== 1) {
        listError.message = "No active questionnaires for survey " + survey;
    } else {
        listError.message = "Unable to load questionnaires for survey " + survey;
    }

    return <>
        <p>
            <Link to={"/"}>Previous</Link>
        </p>


        <h3>Active questionnaires</h3>
        <table id="basic-table" className="table ">
            <thead className="table__head u-mt-m">
            <tr className="table__row">
                <th scope="col" className="table__header ">
                    <span>Questionnaire</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Field period</span>
                </th>
                <th scope="col" className="table__header ">
                    <span>Link to interview</span>
                </th>
            </tr>
            </thead>
            <tbody className="table__body">
            {
                surveyInstruments && surveyInstruments.length > 0
                    ?
                    surveyInstruments.map((item: Instrument) => {
                        return (
                            <tr className="table__row" key={item.name}>
                                <td className="table__cell ">
                                    {item.name}
                                </td>
                                <td className="table__cell ">
                                    {item.fieldPeriod}
                                </td>
                                <td className="table__cell ">
                                    <ExternalLink text={"Interview"}
                                                  link={item.link}
                                                  ariaLabel={"Launch interview for instrument " + item.name + " " + item.fieldPeriod}/>
                                </td>
                            </tr>
                        );
                    })
                    :
                    <tr>
                        <td className="table__cell " colSpan={3}>
                            {listError.message}
                        </td>
                    </tr>
            }
            </tbody>
        </table>
    </>;
}

export default InstrumentList;

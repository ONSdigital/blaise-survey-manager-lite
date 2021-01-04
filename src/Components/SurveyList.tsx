import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import {Survey} from "../../Interfaces";

interface listError {
    error: boolean,
    message: string
}

interface Props {
    list: Survey[],
    listError: listError
}

function SurveyList({list, listError}: Props): ReactElement {

    return <>
        <h2>Surveys</h2>
        {
            list && list.length > 0
                ?
                <table id="survey-table" className="table ">
                    <thead className="table__head u-mt-m">
                    <tr className="table__row">
                        <th scope="col" className="table__header ">
                            <span>Survey three letter acronym</span>
                        </th>
                        <th scope="col" className="table__header ">
                            <span>Link to questionnaires</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="table__body">
                    {
                        list.map(({survey}: Survey) => {
                            return (
                                <tr className="table__row" key={survey} data-testid={"survey-table-row"}>
                                    <td className="table__cell ">
                                        {survey}
                                    </td>
                                    <td className="table__cell ">
                                        <Link to={`/survey/${survey}`}>View active questionnaires</Link>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
                :
                <div className="panel panel--info panel--simple u-mb-m">
                    <div className="panel__body">
                        <p>{listError.message}</p>
                    </div>
                </div>
        }
    </>;
}

export default SurveyList;

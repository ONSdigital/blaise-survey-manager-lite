interface EnvironmentVariables {
    VM_EXTERNAL_CLIENT_URL: string
    VM_EXTERNAL_WEB_URL: string
    BLAISE_API_URL: string
    CATI_DASHBOARD_URL: string
    BIMS_CLIENT_ID: string
    BIMS_API_URL: string
}

export function getEnvironmentVariables(): EnvironmentVariables {
    let {VM_EXTERNAL_CLIENT_URL, 
        VM_EXTERNAL_WEB_URL, 
        BLAISE_API_URL, 
        BIMS_CLIENT_ID, 
        BIMS_API_URL} = process.env;
    const CATI_DASHBOARD_URL = "https://" + VM_EXTERNAL_WEB_URL + "/Blaise";

    if (BLAISE_API_URL === undefined) {
        console.error("BLAISE_API_URL environment variable has not been set");
        BLAISE_API_URL = "ENV_VAR_NOT_SET";
    }

    if (VM_EXTERNAL_WEB_URL === undefined) {
        console.error("VM_EXTERNAL_WEB_URL environment variable has not been set");
        VM_EXTERNAL_WEB_URL = "ENV_VAR_NOT_SET";
    }

    if (VM_EXTERNAL_CLIENT_URL === undefined) {
        console.error("VM_EXTERNAL_WEB_URL environment variable has not been set");
        VM_EXTERNAL_CLIENT_URL = "ENV_VAR_NOT_SET";
    }

    if (BIMS_CLIENT_ID === undefined) {
        console.error("BIMS_CLIENT_ID environment variable has not been set");
        BIMS_CLIENT_ID = "ENV_VAR_NOT_SET";
    }

    if (BIMS_API_URL === undefined) {
        console.error("BIMS_API_URL environment variable has not been set");
        BIMS_API_URL = "ENV_VAR_NOT_SET";
    }

    return {VM_EXTERNAL_CLIENT_URL, 
        VM_EXTERNAL_WEB_URL, 
        BLAISE_API_URL, 
        CATI_DASHBOARD_URL, 
        BIMS_CLIENT_ID, 
        BIMS_API_URL};
}

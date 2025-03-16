/** Get url parameter by name */
export function getUrlParam(param: string) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

/** Get url parameter by name and ensure value as number, if that can be converted, or null otherwise */
export function getUrlParamnumber(param: string) {
    const value = getUrlParam(param);
    if (!value) return null;
    const valuenumber = parseInt(value);
    if (isNaN(valuenumber)) return null;
    return valuenumber;
}

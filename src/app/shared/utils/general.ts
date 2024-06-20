export const get_domain = (url: string) => {
    const data = url.split(".");
    let domain = data[0].split("://")[1]
    if (domain == "www") {
        domain = data[1]
    }
    return domain;
};
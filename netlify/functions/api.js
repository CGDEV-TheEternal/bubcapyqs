exports.handler = async function (event) {
    const path = event.queryStringParameters?.endpoint;

    const endpoints = {
        search: "https://bubcapyqs.thsite.top/search.php",
        upload: "https://bubcapyqs.thsite.top/upload.php",
        feedback: "https://bubcapyqs.thsite.top/feedback.php"
    };

    if (!path || !endpoints[path]) {
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                success: false,
                error: "Invalid endpoint"
            })
        };
    }

    try {
        const headers = {};

        // Forward Content-Type
        if (event.headers["content-type"]) {
            headers["Content-Type"] = event.headers["content-type"];
        }

        const response = await fetch(endpoints[path], {
            method: event.httpMethod,
            headers: headers,
            body: event.httpMethod === "GET"
                ? undefined
                : event.body
        });

        const data = await response.text();

        return {
            statusCode: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("content-type") ||
                    "application/json"
            },
            body: data
        };

    } catch (error) {
        console.error("Proxy error:", error);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                success: false,
                error: "Could not connect to PHP server"
            })
        };
    }
};
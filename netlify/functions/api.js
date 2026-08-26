exports.handler = async function (event) {

    const endpoint = event.queryStringParameters?.endpoint;

    const urls = {
        search: "https://bubcapyqs.thsite.top/search.php",
        upload: "https://bubcapyqs.thsite.top/upload.php",
        feedback: "https://bubcapyqs.thsite.top/feedback.php"
    };

    if (!urls[endpoint]) {
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: "Invalid endpoint"
            })
        };
    }

    try {

        const contentType =
            event.headers["content-type"] ||
            event.headers["Content-Type"] ||
            "";

        let body = undefined;

        if (event.httpMethod !== "GET") {
            body = event.isBase64Encoded
                ? Buffer.from(event.body, "base64")
                : event.body;
        }

        const response = await fetch(urls[endpoint], {
            method: event.httpMethod,
            headers: {
                "Content-Type": contentType
            },
            body: body
        });

        const responseText = await response.text();

        console.log("Method:", event.httpMethod);
        console.log("PHP status:", response.status);
        console.log("PHP response:", responseText);

        return {
            statusCode: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("content-type") ||
                    "application/json"
            },
            body: responseText
        };

    } catch (error) {

        console.error(error);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};

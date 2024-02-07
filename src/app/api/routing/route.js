export async function POST(request) {
    const { departure, destination, preference } = await request.json();
    let result = {};

    const payload = {
        coordinates: [
            [departure.lng, departure.lat],
            [destination.lng, destination.lat],
        ],
        preference: preference,
    };

    console.log(payload);

    await fetch("http://182.253.86.90:8080/ors/v2/directions/driving-car", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            result = data;
        });

    return Response.json({
        status: 200,
        message: "OK",
        result,
    });
}

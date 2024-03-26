import { supabase } from "@/lib/supabase";
import { randomStringGenerator } from "@/lib/helpers";

export async function POST(request) {
    const { url } = await request.json();

    console.log(url);

    let shortlink = randomStringGenerator(6);

    const { data, error } = await supabase
        .from("Shortlinks")
        .select()
        .eq("shortlink", shortlink)
        .single();

    if (data === null) {
        const ins = await supabase
            .from("Shortlinks")
            .insert({ shortlink, original: url })
            .select();

        if (ins.error) {
            return Response.json({
                status: 500,
                desc: "INSERT DATA ERROR",
                msg: ins.error.message,
            });
        }

        return Response.json({
            status: 200,
            msg: "Berhasil memendekkan URL",
            shortlink: ins.data[0].shortlink,
        });
    } else {
        shortlink = randomStringGenerator(6);
        const ins = await supabase
            .from("Shortlinks")
            .insert({ shortlink, original: url })
            .select();

        if (ins.error) {
            return Response.json({
                status: 500,
                desc: "INSERT DATA ERROR",
                msg: ins.error.message,
            });
        }

        return Response.json({
            status: 200,
            msg: "Berhasil memendekkan URL",
            shortlink: ins.data[0].shortlink,
        });
    }
}

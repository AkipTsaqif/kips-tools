"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function LinkShortener() {
    const [url, setUrl] = useState("");
    const [shortlink, setShortlink] = useState("");

    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errDesc, setErrDesc] = useState("");
    const [msg, setMsg] = useState("");

    const getLink = async () => {
        await fetch("http://localhost:3000/api/shortlink", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === 500) {
                    setIsError(true);
                    setMsg(data.msg);
                    setErrDesc(data.desc);
                    return;
                }

                setIsSuccess(true);
                setShortlink(data.shortlink);
            });
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-52px)]">
            <div className="flex flex-col items-center gap-4">
                <p className="font-bold text-lg">Link Shortener</p>
                <div className="w-[50vw] flex gap-4">
                    <Input
                        placeholder="Masukkan URL"
                        className="w-[85%] rounded-[6px]"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button
                        className="w-[15%] rounded-[6px]"
                        onClick={() => {
                            getLink();
                        }}
                    >
                        Shorten
                    </Button>
                </div>
                {isSuccess && (
                    <div className="flex">
                        <p className="pr-4">Shortlink:</p>
                        <a
                            href={`http://localhost:3000/${shortlink}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {`http://localhost:3000/${shortlink}`}
                        </a>
                    </div>
                )}
                {isError && <p>{`${errDesc}: ${msg}`}</p>}
            </div>
        </div>
    );
}

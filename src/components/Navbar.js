"use client";

import { usePathname } from "next/navigation";
import { kebabToTitle } from "@/lib/helpers";
import Link from "next/link";

export default function Navbar() {
    const pathname = kebabToTitle(usePathname());

    return (
        <div className="sticky flex items-center justify-between px-4 top-0 left-0 right-0 border-b-[2px] min-h-[52px] drop-shadow-sm">
            <div className="flex gap-8 items-center">
                <p className="font-bold">
                    {pathname !== "" ? `${pathname} - ` : ""}Kips Helper
                </p>
                <Link href="/">
                    <p className="text-sm">Kumpulan Alat</p>
                </Link>
                <Link href="/peta">
                    <p className="text-sm">Peta</p>
                </Link>
            </div>
            {pathname ? <Link href="/">Home</Link> : null}
        </div>
    );
}

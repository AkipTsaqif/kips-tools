import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Home() {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-52px)]">
            <div className="flex flex-col items-center">
                <p className="font-bold text-xl mb-4">Pilih Alat Bantu</p>
                <div className="flex gap-4">
                    <Link href="/pencari-kata">
                        <Card className="flex justify-center items-center w-[160px] h-[160px] cursor-pointer hover:bg-neutral-100">
                            <CardContent className="flex flex-col items-center p-0">
                                <p>Pencari Kata</p>
                                <Image
                                    src="/word-finder.png"
                                    width={80}
                                    height={80}
                                    alt="Pencari kata"
                                />
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/pembuat-tts">
                        <Card className="flex justify-center items-center w-[160px] h-[160px] cursor-pointer hover:bg-neutral-100">
                            <CardContent className="flex flex-col items-center p-0">
                                <p>Pembuat TTS</p>
                                <Image
                                    src="/word-finder.png"
                                    width={80}
                                    height={80}
                                    alt="Pencari kata"
                                />
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}

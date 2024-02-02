"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function WordFinder() {
    const [wordEntered, setWordEntered] = useState(false);
    const [word, setWord] = useState("");
    const [wordsFound, setWordsFound] = useState({});

    const [totalSearch, setTotalSearch] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [mostWordsFound, setMostWordsFound] = useState(0);
    const [longestLetters, setLongestLetters] = useState("");

    const fetchWord = async () => {
        const response = await fetch(`http://localhost:3000/api?word=${word}`);
        const data = await response.json();
        groupWords(data.words);
    };

    const groupWords = (words) => {
        if (!words) {
            return;
        }

        const groupedWords = words.reduce((acc, word) => {
            const length = word.length;
            if (!acc[length]) {
                acc[length] = [];
            }
            acc[length].push(word);
            return acc;
        }, {});

        // storageOperation(Object.values(groupedWords).flat().length);
        setWordsFound(groupedWords);
    };

    useEffect(() => {
        if (Object.keys(wordsFound).length > 0) {
            storageOperation(Object.values(wordsFound).flat().length);
        }
    }, [wordsFound]);

    const storageOperation = (newWords) => {
        localStorage.setItem("totalSearch", totalSearch + 1);
        localStorage.setItem("totalWords", totalWords + newWords);

        setTotalSearch(totalSearch + 1);
        setTotalWords(totalWords + newWords);

        if (newWords > mostWordsFound) {
            localStorage.setItem("mostWordsFound", newWords);
            localStorage.setItem("longestLetters", word);

            setMostWordsFound(newWords);
            setLongestLetters(word);
        }
    };

    useEffect(() => {
        if (word) {
            fetchWord();
            setWordEntered(true);
        }
    }, [word]);

    useEffect(() => {
        const totalSearchStorage = localStorage.getItem("totalSearch");
        const totalWordsStorage = localStorage.getItem("totalWords");
        const mostWordsFoundStorage = localStorage.getItem("mostWordsFound");
        const longestLettersStorage = localStorage.getItem("longestLetters");

        if (totalSearchStorage) {
            setTotalSearch(totalSearchStorage);
        }

        if (totalWordsStorage) {
            setTotalWords(totalWordsStorage);
        }

        if (mostWordsFoundStorage) {
            setMostWordsFound(mostWordsFoundStorage);
        }

        if (longestLettersStorage) {
            setLongestLetters(longestLettersStorage);
        }
    }, []);

    return (
        <div className="flex gap-2 p-6">
            <div className="flex flex-col items-center w-[75%]">
                <div className="w-[600px] flex gap-4">
                    <Input
                        placeholder="Masukkan huruf acak"
                        className="w-[80%] rounded-[6px]"
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setWord(e.target.value);
                            }
                        }}
                    />
                    <Button
                        className="w-[20%] rounded-[6px]"
                        onClick={() => {
                            fetchWord();
                            setWordEntered(true);
                        }}
                    >
                        Cari
                    </Button>
                </div>
                {wordEntered && (
                    <div className="w-[800px] mt-4 mb-4">
                        <span className="text-xl font-bold mt-8">
                            Kata yang dapat dibentuk
                        </span>
                        <div className="flex flex-col gap-2 mt-2">
                            {Object.keys(wordsFound).map((key) => (
                                <div key={key}>
                                    <span className="text-lg mt-2">
                                        {key} huruf:
                                    </span>
                                    <div className="flex flex-wrap ml-3">
                                        {wordsFound[key].map((word) => (
                                            <div
                                                key={word}
                                                className="flex flex-col justify-center items-center p-1"
                                            >
                                                <span className="text-md font-bold">
                                                    {word}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="w-[25%]">
                <Card>
                    <CardHeader>
                        <CardTitle>Statistik</CardTitle>
                        <CardDescription>
                            Beberapa fakta menarik terkait pencarianmu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 mb-2">
                        <div className="flex gap-2 justify-between items-center w-">
                            <CardDescription>Total pencarian</CardDescription>
                            <p>{totalSearch}</p>
                        </div>
                        <div className="flex gap-2 justify-between items-center">
                            <CardDescription>
                                Total kata ditemukan
                            </CardDescription>
                            <p>{totalWords}</p>
                        </div>
                        <div className="flex gap-2 justify-between items-center">
                            <CardDescription>
                                Kata terbanyak ditemukan
                            </CardDescription>
                            <div className="relative">
                                <p>{mostWordsFound}</p>
                                {mostWordsFound > 0 && (
                                    <p className="text-xs text-neutral-400 absolute right-0 top-5">
                                        ({longestLetters})
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

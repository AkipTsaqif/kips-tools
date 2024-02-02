"use client";

import QAList from "@/components/QAList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function CrosswordGenerator() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    return (
        <div className="flex gap-2 p-6 h-[calc(100vh-52px)]">
            <div className="flex flex-col gap-12 w-1/3 ">
                <div className="flex flex-col gap-2 h-1/4">
                    <Textarea
                        placeholder="Masukkan pertanyaan"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <Input
                        placeholder="Masukkan jawaban"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                    <Button
                        onClick={() => {
                            setQuestions([...questions, question]);
                            setAnswers([...answers, answer]);

                            setQuestion("");
                            setAnswer("");
                        }}
                    >
                        Simpan
                    </Button>
                </div>
                <div className="h-3/4">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex flex-col gap-4">
                            <p className="font-bold underline text-xl">
                                Daftar Pertanyaan - Jawaban
                            </p>
                            <div>
                                {console.log(questions)}
                                {questions.length > 0 && (
                                    <QAList
                                        questions={questions}
                                        answers={answers}
                                    />
                                )}
                            </div>
                        </div>
                        <Button>Buat TTS</Button>
                    </div>
                </div>
            </div>
            <div className="w-2/3"></div>
        </div>
    );
}

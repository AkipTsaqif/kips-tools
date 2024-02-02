export default function QAList({ questions, answers }) {
    const qa = questions.map((question, index) => ({
        question,
        answer: answers[index],
    }));

    return (
        <div>
            {qa.map((data, index) => (
                <div key={index} className="pb-2">
                    <p>{data.question}</p>
                    <p>→ {data.answer}</p>
                </div>
            ))}
        </div>
    );
}

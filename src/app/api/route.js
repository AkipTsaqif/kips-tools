import fs from "fs";

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const letters = searchParams.get("word");

    const canFormWord = (word, jumbledLetters) => {
        const wordLetters = word.toLowerCase().split("");
        const jumbledLettersArray = jumbledLetters.split("");

        return wordLetters.every((letter) => {
            const index = jumbledLettersArray.indexOf(letter);
            if (index !== -1) {
                jumbledLettersArray.splice(index, 1);
                return true;
            }
            return false;
        });
    };

    const hasCorrectLetterFrequency = (word, jumbledLetters) => {
        const wordLetterCount = getLetterCount(word);
        const jumbledLettersCount = getLetterCount(jumbledLetters);

        return Object.keys(wordLetterCount).every((letter) => {
            return (
                wordLetterCount[letter] <= (jumbledLettersCount[letter] || 0)
            );
        });
    };

    const getLetterCount = (str) => {
        const letterCount = {};
        for (const letter of str) {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }
        return letterCount;
    };

    const sortResult = (a, b) => {
        if (a.length === b.length) {
            // If lengths are equal, sort by the first letter
            return a.localeCompare(b);
        }
        // Otherwise, sort by length in ascending order
        return a.length - b.length;
    };

    try {
        const rawWords = fs.readFileSync(
            "./src/resources/indonesian-wordlist.lst",
            "utf8"
        );
        const words = rawWords.split("\n").filter((line) => line.trim() !== "");
        const matchedWords = words
            // .filter((word) => word.toLowerCase().includes(letters))
            .filter((word) => canFormWord(word, letters))
            .filter((word) => hasCorrectLetterFrequency(word, letters))
            .filter((word) => word.length >= 3)
            .sort((a, b) => sortResult(a, b));

        return Response.json({
            status: 200,
            message: "OK",
            words: matchedWords,
        });
    } catch (error) {
        return Response.json({
            status: 500,
            message: "Internal Server Error",
            reason: error,
            words: [],
        });
    }
}

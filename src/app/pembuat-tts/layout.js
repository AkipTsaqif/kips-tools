export async function generateMetadata({ params }) {
    return {
        title: `Pembuat TTS - Kips Helper`,
        description: `Alat untuk membantumu membuatkan TTS dari pertanyaan dan jawaban yang disediakan - Kips Helper`,
    };
}

export default function Layout({ children }) {
    return <div>{children}</div>;
}

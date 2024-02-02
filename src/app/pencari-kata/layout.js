export async function generateMetadata({ params }) {
    return {
        title: `Pencari Kata - Kips Helper`,
        description: `Temukan kata yang ingin dicari hanya dengan memasukkan huruf acak. Berguna untuk membantu mencari kata dalam permainan kata seperti Scrabble, Word of Wonders, dll - Kips Helper`,
    };
}

export default function Layout({ children }) {
    return <div>{children}</div>;
}

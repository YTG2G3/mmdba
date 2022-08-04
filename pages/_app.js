import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <>
            <Head>
                <title>MentaMorph Database Admin</title>
            </Head>

            <Component {...pageProps} />
        </>
    );
}
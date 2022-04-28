import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import 'styles/globals.css';

import { nftService } from 'services';
import { Nav, Alert, Wallet } from 'components';

export default App;

function App({ Component, pageProps }) {
    const router = useRouter();
    const [nft, setNft] = useState(null);
    const [ownedNfts, setOwnedNfts] = useState([]);
    const [listedNfts, setListedNfts] = useState([]);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        setNft(nftService.nftValue);
        router.push('/nfts');
        // on initial load - run auth check 
        // authCheck(router.asPath);
        // nftService.getAll().then(x => setListedNfts(x));

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in 
        setNft(nftService.nftValue);
        const publicPaths = ['/account/login', '/account/register', '/nfts/*'];
        const path = url.split('?')[0];
        // if (!nftService.nftValue && !publicPaths.includes(path)) {
        //     setAuthorized(false);
        setAuthorized(true);
        // router.push('/nfts');
        // } else {
        // }
    }

    return (
        <>
            <Head>
                <title>BlackRPC IP submit form</title>
                
                {/* eslint-disable-next-line @next/next/no-css-tags */}
                <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
            </Head>

            <div className={`app-container ${nft ? 'bg-light' : ''}`}>
                <Wallet>
                    <Nav />
                    <Alert />
                    <Component {...pageProps} ownedNfts={ownedNfts} setOwnedNfts={setOwnedNfts} listedNfts={listedNfts} setListedNfts={setListedNfts} />
                </Wallet>
            </div>
        </>
    );
}

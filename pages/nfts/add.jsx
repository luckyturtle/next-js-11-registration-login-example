import { useWallet } from '@solana/wallet-adapter-react';
import { Layout, AddEdit } from 'components/users';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default Add;

function Add({ownedNfts, listedNfts}) {
    const wallet = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (!wallet.connected || ownedNfts.length == 0) {
            router.push('/nfts');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.connected, ownedNfts]);

    return (
        <Layout>
            <h1>Add Nft</h1>
            <AddEdit ownedNfts={ownedNfts} listedNfts={listedNfts} address={wallet.publicKey} />
        </Layout>
    );
}
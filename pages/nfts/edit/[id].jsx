import { useState, useEffect } from 'react';

import { Layout, AddEdit } from 'components/users';
import { Spinner } from 'components';
import { nftService, alertService } from 'services';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';

export default Edit;

function Edit({ id, ownedNfts }) {
    const wallet = useWallet();
    const router = useRouter();

    const [nft, setNft] = useState(null);

    useEffect(() => {
        // fetch nft and set default form values if in edit mode
        nftService.getById(id)
            .then(x => setNft(x))
            .catch(alertService.error)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!wallet.connected || ownedNfts.length == 0) {
            router.push('/nfts');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.connected, ownedNfts]);


    return (
        <Layout>
            <h1>Edit Nft</h1>
            {nft ? <AddEdit nft={nft} ownedNfts={ownedNfts} address={wallet.publicKey} /> : <Spinner /> }
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return {
        props: { id: params.id }
    }
}

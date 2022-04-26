import { useState, useEffect } from 'react';

import { Link, Spinner } from 'components';
import { Layout } from 'components/users';
import { nftService } from 'services';
import { useWallet } from '@solana/wallet-adapter-react';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { COLLECTION_CREATOR, solConnection } from 'helpers/config';

export default Index;

function Index({ownedNfts, setOwnedNfts}) {
    const wallet = useWallet();
    const [nfts, setNfts] = useState(null);
    const [unstakedLoading, setUnStakedLoading] = useState(false);

    useEffect(() => {
        nftService.getAll().then(x => setNfts(x));
    }, []);

    useEffect(() => {
        if (!wallet.connected) {
            setOwnedNfts([]);
            return;
        }
        getUnstakedNFTs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.connected])

    useEffect(() => {
        console.log('Owned Nfts:', ownedNfts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownedNfts]);

    const getUnstakedNFTs = async () => {
        setUnStakedLoading(true);

        const unstakedNftList = await getMetadataDetail();
        // console.log(unstakedNftList, "==> list")

        if (unstakedNftList.length !== 0) {
        let nftDump = [], count = 0, nftCount = 0;
        for (let item of unstakedNftList) {
            if (item.data.creators && item.data.creators[0]?.address === COLLECTION_CREATOR) {
            nftCount++;
            await fetch(item.data.uri)
                .then(resp =>
                resp.json()
                ).catch((e) => {
                return {
                    name: 'Unknown',
                    image: '/nft.png',
                }
                }).then((json) => {
                nftDump.push({
                    "name": json.name,
                    "image": json.image,
                    "mint": item.mint,
                });
                count++;
                })
            }
        }
        // Lazy loading nft arweave data and image
        // await new Promise((resolve, reject) => {
        //   const itv = setInterval(() => {
            setOwnedNfts(nftDump);
        //     // console.log('==> fetching', nftDump.length);
        //     if (count === nftCount) {
        //       // console.log('==> all fetched');
        //       console.log(nftDump);
        //       clearInterval(itv);
        //       resolve(true);
        //     }
        //   }, 500);
        // });
        } else {
            setOwnedNfts([]);
        }
        setUnStakedLoading(false);
    }

    const getMetadataDetail = async () => {
        if (!wallet.publicKey) return [];
        const nftsList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection: solConnection });
        return nftsList;
    }

    function deleteUser(id) {
        setNfts(nfts.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        nftService.delete(id).then(() => {
            setNfts(nfts => nfts.filter(x => x.id !== id));
        });
    }

    return (
        <Layout>
            { unstakedLoading ? 
                <Spinner />
            :
                <h1>{ownedNfts.length} nfts in wallet</h1>
            }
            { ownedNfts.length > 0 &&
                <Link href="/nfts/add" className="btn btn-sm btn-success mb-2">Add Nft</Link>
            }
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>NFT Pubkey</th>
                        <th style={{ width: '30%' }}>IP Address</th>
                        <th style={{ width: '30%' }}>Discord ID</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {nfts && nfts.filter((nft) => {
                        if (ownedNfts.length == 0) return 1;
                        if (ownedNfts.map((nft) => nft.mint).indexOf(nft.pubkey) == -1) return 0;
                        return 1;
                    }).map(nft =>
                        <tr key={nft.id}>
                            <td>{nft.pubkey}</td>
                            <td>{nft.ipAddress}</td>
                            <td>{nft.discordId}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                { ownedNfts.length > 0 &&
                                <>
                                    <Link href={`/nfts/edit/${nft.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                    <button onClick={() => deleteUser(nft.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={nft.isDeleting}>
                                        {nft.isDeleting 
                                            ? <span className="spinner-border spinner-border-sm"></span>
                                            : <span>Delete</span>
                                        }
                                    </button>
                                </>
                                }
                            </td>
                        </tr>
                    )}
                    {!nfts &&
                        <tr>
                            <td colSpan="4">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    {nfts && !nfts.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Nfts To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Layout>
    );
}

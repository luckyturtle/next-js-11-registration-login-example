import { useState, useEffect } from 'react';

// import { NavLink } from '.';
import { nftService } from 'services';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export { Nav };

function Nav() {
    const [nft, setNft] = useState(null);

    useEffect(() => {
        const subscription = nftService.nft.subscribe(x => setNft(x));
        return () => subscription.unsubscribe();
    }, []);

    // function logout() {
    //     nftService.logout();
    // }
    
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <WalletModalProvider>
                    <WalletMultiButton />
                </WalletModalProvider>
            </div>
        </nav>
    );
}
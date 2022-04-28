import { web3 } from '@project-serum/anchor';

export const solConnection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
// export const solConnection = new web3.Connection("https://solana-api.projectserum.com");

export const COLLECTION_CREATOR = "5NKURKDUonfEhZuxoAu8A6FWz1RH1y1gEqeVzUecw5Fa";

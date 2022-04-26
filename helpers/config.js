import { web3 } from '@project-serum/anchor';

// export const solConnection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
export const solConnection = new web3.Connection("https://solana-api.projectserum.com");

export const COLLECTION_CREATOR = "9dp7T97G1ghin6mgCCmcHsvy8FbFpyydQKyYvZD5czxd";
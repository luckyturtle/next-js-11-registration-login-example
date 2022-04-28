import { apiHandler, nftsRepo, omit } from 'helpers/api';

export default apiHandler({
    get: getIpMatch,
});

function getIpMatch(req, res) {
    // return users without hashed passwords in the response
    const response = nftsRepo.getAll().map(x => omit(x, 'hash'));
    return res.status(200).json(response.map((nft) => {
        return '#' + nft.discordId + '\n' + nft.ipAddress;
    }).join('\n'));
}

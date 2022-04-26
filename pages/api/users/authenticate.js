// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
import getConfig from 'next/config';

import { apiHandler, nftsRepo } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();

export default apiHandler({
    post: authenticate
});

function authenticate(req, res) {
    // const { discordId } = req.body;
    // const nft = nftsRepo.find(u => u.discordId === discordId);
    const nft = {};
    // // validate
    // if (!(nft && bcrypt.compareSync(password, nft.hash))) {
    //     throw 'discordId or password is incorrect';
    // }

    // create a jwt token that is valid for 7 days
    // const token = jwt.sign({ sub: nft.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    // return basic nft details and token
    return res.status(200).json({
        id: nft.id,
        discordId: nft.discordId,
        pubkey: nft.pubkey,
        ipAddress: nft.ipAddress,
        token: undefined,
    });
}

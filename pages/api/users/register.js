// const bcrypt = require('bcryptjs');

import { apiHandler, nftsRepo } from 'helpers/api';

export default apiHandler({
    post: register
});

function register(req, res) {
    // split out password from user details 
    const { ...nft } = req.body;

    // validate
    // if (nftsRepo.find(x => x.discordId === nft.discordId))
    //     throw `Nft with the discordId "${nft.discordId}" already exists`;

    // hash password
    // nft.hash = bcrypt.hashSync(password, 10);    

    nftsRepo.create(nft);
    return res.status(200).json({});
}

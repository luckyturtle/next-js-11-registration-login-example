// const bcrypt = require('bcryptjs');

import { apiHandler } from 'helpers/api';
import { nftsRepo, omit } from 'helpers/api';

export default apiHandler({
    post: getById,
    put: update,
    delete: _delete
});

function getById(req, res) {
    const nft = nftsRepo.getById(req.query.id);

    if (!nft) throw 'Nft Not Found';

    return res.status(200).json(omit(nft, 'hash'));
}

function update(req, res) {
    const nft = nftsRepo.getById(req.query.id);

    if (!nft) throw 'Nft Not Found';

    // split out password from Nft details 
    const { ...params } = req.body;

    // validate
    // if (nft.discordId !== params.discordId && nftsRepo.find(x => x.discordId === params.discordId))
    //     throw `Nft with the discordId "${params.discordId}" already exists`;

    // // only update hashed password if entered
    // if (password) {
    //     Nft.hash = bcrypt.hashSync(password, 10);
    // }

    nftsRepo.update(req.query.id, params);
    return res.status(200).json({});
}

function _delete(req, res) {
    nftsRepo.delete(req.query.id);
    return res.status(200).json({});
}

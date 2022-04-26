const fs = require('fs');

// nfts in JSON file for simplicity, store in a db for production applications
let nfts = require('data/nfts.json');

export const nftsRepo = {
    getAll: () => nfts,
    getById: id => nfts.find(x => x.id.toString() === id.toString()),
    find: x => nfts.find(x),
    create,
    update,
    delete: _delete
};

function create(nft) {
    // generate new nft id
    nft.id = nfts.length ? Math.max(...nfts.map(x => x.id)) + 1 : 1;

    // set date created and updated
    nft.dateCreated = new Date().toISOString();
    nft.dateUpdated = new Date().toISOString();

    // add and save nft
    nfts.push(nft);
    saveData();
}

function update(id, params) {
    const nft = nfts.find(x => x.id.toString() === id.toString());

    // set date updated
    nft.dateUpdated = new Date().toISOString();

    // update and save
    Object.assign(nft, params);
    saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id) {
    // filter out deleted nft and save
    nfts = nfts.filter(x => x.id.toString() !== id.toString());
    saveData();
    
}

// private helper functions

function saveData() {
    fs.writeFileSync('data/nfts.json', JSON.stringify(nfts, null, 4));
}
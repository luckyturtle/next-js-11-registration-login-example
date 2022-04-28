import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const nftSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('nft')));

export const nftService = {
    nft: nftSubject.asObservable(),
    get nftValue () { return nftSubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};

function login(nftname, password) {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { nftname })
        .then(nft => {
            // publish nft to subscribers and store in local storage to stay logged in between page refreshes
            nftSubject.next(nft);
            localStorage.setItem('nft', JSON.stringify(nft));

            return nft;
        });
}

function logout() {
    // remove nft from local storage, publish null to nft subscribers and redirect to login page
    localStorage.removeItem('nft');
    nftSubject.next(null);
    // Router.push('/users');
}

function register(nft) {
    return fetchWrapper.post(`${baseUrl}/register`, nft);
}

function getAll() {
    return fetchWrapper.post(baseUrl);
}

function getById(id) {
    return fetchWrapper.post(`${baseUrl}/${id}`);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(x => {
            // update stored nft if the logged in nft updated their own record
            // if (id === nftSubject.value.id) {
                // update local storage
                // const nft = { ...nftSubject.value, ...params };
                // localStorage.setItem('nft', JSON.stringify(nft));

                // publish updated nft to subscribers
                // nftSubject.next(nft);
            // }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}

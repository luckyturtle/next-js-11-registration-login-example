import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { nftService, alertService } from 'services';
import { useEffect } from 'react';

export { AddEdit };

function AddEdit(props) {
    const nft = props?.nft;
    const isAddMode = !nft;
    const router = useRouter();

    useEffect(() => {
        if (props.ownedNfts && props.ownedNfts.length > 0) {
            console.log(props.listedNfts)
        }
        if (!props.address) router.push('/nfts');
    }, [props]);
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        pubkey: Yup.string()
            .required('NFT Pubkey is required'),
        ipAddress: Yup.string()
            .required('IP Address is required'),
        discordId: Yup.string()
            .required('Discord ID is required'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (!isAddMode) {
        formOptions.defaultValues = props.nft;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        // Validation check
        if (data.discordId.indexOf('#') === -1)
            return alertService.error('Invalid Discord Id');

        const discordBufs = data.discordId.split('#');
        const id = discordBufs[discordBufs.length - 1];
        if (id.length !== 4 || !/^\d+$/.test(id))
            return alertService.error('Invalid Discord Id');

        if (data.ipAddress === '0.0.0.0') return alertService.error('Invalid IP Address');
        const ipBufs = data.ipAddress.split('.');
        if (ipBufs.length !== 4)
            return alertService.error('Invalid IP Address');

        for (let buf of ipBufs) {
            if (!/^\d+$/.test(buf) || parseInt(buf) > 254)
                return alertService.error('Invalid IP Address');
            if (buf.length > 1 && buf[0] === '0')
                return alertService.error('Invalid IP Address');
        }

        return isAddMode
            ? createNft({
                ...data,
                wallet: props.address.toBase58(),
            })
            : updateNft(nft.id, {
                ...data,
                wallet: props.address.toBase58(),
            });
    }

    function createNft(data) {
        return nftService.register(data)
            .then(() => {
                alertService.success('Nft added', { keepAfterRouteChange: true });
                router.push('.');
            })
            .catch(alertService.error);
    }

    function updateNft(id, data) {
        return nftService.update(id, data)
            .then(() => {
                alertService.success('Nft updated', { keepAfterRouteChange: true });
                router.push('..');
            })
            .catch(alertService.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
                <div className="form-group col">
                    <label>Nft Pubkey</label>
                    <select name="pubkey" id="pubkey" {...register('pubkey')} className={`form-control ${errors.pubkey ? 'is-invalid' : ''}`}>
                        { props.ownedNfts && props.ownedNfts.filter((nftData) => {
                            if (!nft) {
                                if (!props.listedNfts || props.listedNfts.map((nft) => nft.pubkey).indexOf(nftData.mint) == -1 ) return 1;
                                return 0;
                            }
                            if (nft.pubkey === nftData.mint) return 1;
                            return 0;
                        }).map((nftData, index) => 
                            <option value={nftData.mint} key={index}>{nftData.name} ({nftData.mint.slice(0, 5) + '...' + nftData.mint.slice(-3)})</option>
                        )}
                    </select>
                    {/* <input name="pubkey" type="text" {...register('pubkey')} className={`form-control ${errors.pubkey ? 'is-invalid' : ''}`} /> */}
                    <div className="invalid-feedback">{errors.pubkey?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label>IP Address</label>
                    <input name="ipAddress" type="text" {...register('ipAddress')} className={`form-control ${errors.ipAddress ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.ipAddress?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label>Discord ID</label>
                    <input name="discordId" type="text" {...register('discordId')} className={`form-control ${errors.discordId ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.discordId?.message}</div>
                </div>
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                {!nft && <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>}
                <Link href="/nfts" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}
import React, {useState} from 'react';

import {UserProfile} from 'mattermost-redux/types/users';

import UsersInput from '@/components/users_input';
import {CreateLegalHold} from '@/types';
import {GenericModal} from '@/components/mattermost-webapp/generic_modal/generic_modal';
import Input from '@/components/mattermost-webapp/input/input';

import './create_legal_hold_form.scss';

interface CreateLegalHoldFormProps {
    createLegalHold: (data: CreateLegalHold) => Promise<any>;
    onExited: () => void;
    visible: boolean;
}

const CreateLegalHoldForm = (props: CreateLegalHoldFormProps) => {
    const [displayName, setDisplayName] = useState('');
    const [users, setUsers] = useState(Array<UserProfile>());
    const [startsAt, setStartsAt] = useState('');
    const [endsAt, setEndsAt] = useState('');
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState('');

    const displayNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.target.value);
    };

    const startsAtChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartsAt(e.target.value);
    };

    const endsAtChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndsAt(e.target.value);
    };

    const resetForm = () => {
        setDisplayName('');
        setStartsAt('');
        setEndsAt('');
        setUsers([]);
        setSaving(false);
        setServerError('');
    };

    const onSave = () => {
        if (saving) {
            return;
        }
        setSaving(true);

        const data = {
            user_ids: users.map((user) => user.id),
            ends_at: (new Date(endsAt)).getTime(),
            starts_at: (new Date(startsAt)).getTime(),
            display_name: displayName,
            name: slugify(displayName),
        };

        props.createLegalHold(data).then((response) => {
            resetForm();
            props.onExited();
        }).catch((error) => {
            setSaving(false);
            setServerError(error.toString());
        });
    };

    const onCancel = () => {
        resetForm();
        props.onExited();
    };

    // TODO: Implement validation.
    const canCreate = true;

    return (
        <GenericModal
            id='new-legal-hold-modal'
            className='new-legal-hold-modal'
            modalHeaderText='Create a new legal hold'
            confirmButtonText='Create legal hold'
            cancelButtonText='Cancel'
            errorText={serverError}
            isConfirmDisabled={!canCreate}
            autoCloseOnConfirmButton={false}
            compassDesign={true}
            handleConfirm={onSave}
            handleEnterKeyPress={onSave}
            handleCancel={onCancel}
            onExited={onCancel}
            show={props.visible}
        >
            <div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: '20px',
                    }}
                >
                    <Input
                        type='text'
                        autoComplete='off'
                        autoFocus={false}
                        required={true}
                        name={'Name'}
                        label={'Name'}
                        placeholder={'New Legal Hold...'}
                        limit={64}
                        value={displayName}
                        onChange={displayNameChanged}
                        onBlur={displayNameChanged}
                        containerClassName={'create-legal-hold-container'}
                        inputClassName={'create-legal-hold-input'}
                    />
                    <div>
                        <UsersInput
                            placeholder='@username1 @username2'
                            users={users}
                            onChange={setUsers}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            columnGap: '20px',
                        }}
                    >
                        <Input
                            type='date'
                            autoComplete='off'
                            autoFocus={false}
                            required={true}
                            name={'Starting from'}
                            label={'Starting from'}
                            placeholder={'Starting from'}
                            limit={64}
                            value={startsAt}
                            onChange={startsAtChanged}
                            onBlur={startsAtChanged}
                            containerClassName={'create-legal-hold-container'}
                            inputClassName={'create-legal-hold-input'}
                        />
                        <Input
                            type='date'
                            autoComplete='off'
                            autoFocus={false}
                            required={true}
                            name={'Ending at'}
                            label={'Ending at'}
                            placeholder={'Ending at'}
                            limit={64}
                            value={endsAt}
                            onChange={endsAtChanged}
                            onBlur={endsAtChanged}
                            containerClassName={'create-legal-hold-container'}
                            inputClassName={'create-legal-hold-input'}
                        />
                    </div>
                </div>
            </div>
        </GenericModal>
    );
};

const slugify = (data: string) => {
    return data.
        replace(/[^0-9a-zA-Z _-]/g, '').
        replace(/[ _]/g, '-').
        toLowerCase();
};

export default CreateLegalHoldForm;


import { UsersDatum } from '@/app/(main)/pages/user/UserService';
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { UserForm } from '@/app/(main)/pages/user/UserForm';
import { Button } from 'primereact/button';
import { ImageBodyTemplate } from '@/app/(main)/pages/user/imageBodyTemplate';

interface UserDialogProps {
    dialogVisible: boolean;
    setDialogVisible: (visible: boolean) => void;
    setUsers: React.Dispatch<React.SetStateAction<UsersDatum[]>>;
}

const UserDialog: React.FC<UserDialogProps> = ({dialogVisible, setDialogVisible, setUsers }) => {

    const [user, setUser] = useState<Omit<UsersDatum, 'uuid' | 'deleted' | 'active'>>({
        mobile: '',
        municipal: '',
        email: '',
        address: '',
        lastName: '',
        name: '',
        nationality: '',
        province: '',
        avatar: undefined,
        roles: '',
    });

    const hideDialog = () => {
        setDialogVisible(false);
        setUser({
            mobile: '',
            municipal: '',
            email: '',
            address: '',
            lastName: '',
            name: '',
            nationality: '',
            province: '',
            avatar: undefined,
            roles: '',
        });
    };

    const saveUser = () => {
        const newUser: UsersDatum = {
            ...user,
            uuid: Date.now().toString(),
            active: true,
            deleted: false
        };

        setUsers((prevUsers) => [
            ...prevUsers,
            newUser
        ]);

        hideDialog();
    };

    const userDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={saveUser} />
        </>
    );

    const userData = user as UsersDatum;
    return (
        <Dialog
            visible={dialogVisible}
            style={{ width: '450px' }}
            header="User Details"
            modal
            className="p-fluid"
            footer={userDialogFooter}
            onHide={hideDialog}
        >
            {user.avatar && ImageBodyTemplate({...userData }  ) }
            <UserForm user={user} setUser={setUser} />
        </Dialog>
    );
};


export default UserDialog;

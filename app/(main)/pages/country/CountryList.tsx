import { useState } from 'react';
import { emptyUser } from '@/app/(main)/pages/user/useManagement';
import { UsersDatum } from '@/app/(main)/pages/user/UserService';


export function CountryList() {

    const [user, setUser] = useState<UsersDatum>(emptyUser);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selects, setSelects] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const openNew = () => {
        setUser(emptyUser);
        setUserDialog(true);
    };
    return (
        <></>
    );
}

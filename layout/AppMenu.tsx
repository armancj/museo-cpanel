/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { UsersDatum } from '@/app/(main)/pages/user/UserService';
import styles from './AppMenu.module.css';
import { model } from '@/layout/modelAppmenuConst';

const AppMenu = () => {
    const { layoutConfig,  } = useContext(LayoutContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userRole, setUserRole] = useState('');

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {

        const authUser = JSON.parse(localStorage.getItem('authUser') as string) as UsersDatum;
        if (authUser && authUser.roles) {
            setUserRole(authUser.roles);
        }
    }, []);
    const getFilteredModel = () => {
        if (userRole === 'Administrador' || userRole === 'Especialista') {
            return model.filter(item => item.label === 'Inicio' || item.label === 'Nomencladores' || item.label === 'Aplicación');
        }

        if (userRole === 'Técnico') {
            return model.filter(item => item.label === 'Inicio');
        }

        if (userRole === 'super Administrador') {
            return model;
        }
        return [];
    };

    const filteredModel = getFilteredModel();

    return (
        <MenuProvider>
            <div className={isCollapsed ? styles.layoutMenuCollapsed : styles.layoutMenu}>
                <button onClick={toggleMenu}>Toggle Menu</button>
                <ul className="layout-menu">
                    {filteredModel.map((item, i) => {
                        return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> :
                            <li className="menu-separator"></li>;
                    })}

                    {(userRole === 'super Administrador') ??
                        <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                            <img alt="Prime Blocks" className="w-full mt-3"
                                 src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                        </Link>}
                </ul>
            </div>
        </MenuProvider>
);
};

export default AppMenu;

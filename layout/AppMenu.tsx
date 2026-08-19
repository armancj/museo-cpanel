import { Suspense } from 'react';
import React, { useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { UsersDatum } from '@/app/service/UserService';
import styles from './AppMenu.module.css';
import { model } from '@/layout/modelAppmenuConst';
import { WebEnvConst } from '@/app/webEnvConst';

const AppMenu = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userRole, setUserRole] = useState('');

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        try {
            const stored = localStorage.getItem('authUser');
            const authUser = stored ? (JSON.parse(stored) as UsersDatum) : null;
            if (authUser && authUser.roles) {
                setUserRole(authUser.roles);
            }
        } catch {
            // A corrupted authUser entry must not take the whole menu down.
        }
    }, []);
    const getFilteredModel = () => {

        if (userRole === WebEnvConst.roles.admin || userRole === WebEnvConst.roles.specialist) {
            return model.filter(item => item.label === 'Inicio' || item.label === 'Nomencladores' || item.label === 'Aplicación');
        }

        if (userRole === WebEnvConst.roles.technician) {
            return model.filter(item => {
                if (item.label === 'Inicio') return true;

                if (item.label === 'Aplicación') {
                    return {
                        ...item,
                        items: item.items?.filter(subItem => subItem.label === 'Patrimonio Cultural')
                    };
                }

                return false;
            }).map(item => {
                if (item.label === 'Aplicación') {
                    return {
                        ...item,
                        items: item.items?.filter(subItem => subItem.label === 'Patrimonio Cultural')
                    };
                }
                return item;
            });
        }

        if (userRole === WebEnvConst.roles.superAdmin) {
            return model;
        }


        return [];
    };

    const filteredModel = getFilteredModel();

    return (
        <MenuProvider>
            <div className={isCollapsed ? styles.layoutMenuCollapsed : styles.layoutMenu}>
                            <Suspense fallback={<div>Cargando...</div>}>
                <ul className="layout-menu">
                    {filteredModel.map((item, i) => {
                        return !item?.seperator ?
                            <AppMenuitem item={item} root={true} index={i} key={item.label} /> :
                            <li className="menu-separator"></li>;
                    })}
                </ul>
                            </Suspense>
            </div>
        </MenuProvider>
);
};

export default AppMenu;

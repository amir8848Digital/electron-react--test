/* eslint-disable @next/next/no-img-element */

import React, { useContext, useRef } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { Link } from 'react-router-dom';
import { AppMenuItem } from '../types/layout';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
  
    const model: AppMenuItem[] = [
        // {
        //     label: 'Home',
        //     items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: `${baseUrlFrontend}` }]
        // },
        // {
        //     label: 'Lease Calculator',
        //     items: [
        //         { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: `${baseUrlFrontend}` },
        //         { label: 'New Device', icon: 'pi pi-fw pi-id-card', to:`${baseUrlFrontend}/add-new-device`}
             
        //     ]
        // }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}


            </ul>
        </MenuProvider>
    );
};

export default AppMenu;

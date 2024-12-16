/* eslint-disable @next/next/no-img-element */

import { Link } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/layout';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            {/* <Link to="/" className="layout-topbar-logo">
                <img src={`https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Jio_Financial_Services_Logo.svg/1200px-Jio_Financial_Services_Logo.svg.png`} 
                width="47.22px" height={""} style={{height:'45px !Important'}} alt="logo" />
                <span>
                Jio Leasing Services Ltd</span>
            </Link> */}

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState?.profileSidebarVisible })}>
                {/* <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button> */}
                    {/* <button type="button" className="p-link layout-topbar-button" onClick={()=>window.location.href = '/app'}>
                       <img src={`https://erp-uat-jiolease.8848digitalerp.com/assets/erpnext/images/erpnext-logo.svg`} alt="icon" className='h-2rem' />
                        <span>Settings</span>
                    </button> */}
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;

import React, { useState } from 'react';

import { NavbarComponent } from '../component/head/navbar.component';

interface Props {
    children: JSX.Element;
}

export function PageWrapper(prop: Props) {
    const [currentPage] = useState('/')

    return (
        <div>
            <NavbarComponent />
            <div className='lg:flex-row dark:bg-zinc-500/95'>
                <main className=' rounded-3xl dark:bg-zinc-900/95'>
                    {React.cloneElement(prop.children, { currentPage })}
                </main>
            </div>
        </div>
    );
}
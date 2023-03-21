import { useState, useEffect } from 'react';
import {  Form, Toggle } from 'react-daisyui';

import { PageWrapper } from '../Wrappers/pages.wrapper';
import { Settings } from '../../shared/interfaces/settings.interface';

export function SettingPage() {
    const [startUp, setStartUp] = useState<boolean>(false);

    useEffect(() => {
        async function getStartUpState() {
            const settings: Settings = await window.ipc.getSettings() as Settings;

            setStartUp(settings.startUp);
        }

        getStartUpState();
    }, []);

    function toggleStartUp() {
        window.ipc.toggleStartUP()
            .then((res) => setStartUp(res));
    }

    return (
        <PageWrapper>
            <div className='hero'>
                <div
                    className="px-0 sm:p-4 hero-content text-center max-w-[400px]   mb-1 ">
                    <div className="max-w-full sm:pt-[100px] sm:pb-[100px] sm:pr-[30px] sm:pl-[30px] p-1">
                        <div className={"grid justify-center mb-10"}>
                            <h1 className="text-3xl font-bold mb-2">
                                تنظیمات
                            </h1>
                        </div>
                    </div>
                </div>
                <div className={"mt-20"}>
                    <div className=" mt-2 flex flex-grow gap-2 ml-2 mb-0 top-1">
                        <Form className="bg-base-200 p-4 rounded-lg shadow">
                            <Form.Label title="اجرا شدن خودکار برنامه با روشن شدن سیستم">
                                <Toggle className="m-2" color='success'
                                        defaultChecked={startUp}
                                        checked={startUp}
                                        onClick={() => toggleStartUp()}/>
                            </Form.Label>
                        </Form>
                    </div>
                </div>
            </div>

        </PageWrapper>
    )
}

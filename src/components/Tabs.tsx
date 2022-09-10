import React, {FunctionComponent, ReactNode, useState} from 'react';

interface OwnProps {
    tabs: Array<{
        label: string
        content: ReactNode
    }>
}

type Props = OwnProps;

export const Tabs: FunctionComponent<Props> = (props) => {
    const [activeTab, setActiveTab] = useState<number>()

    return (
        <div className={'tab-container'}>
            <div className={'tab-links'}>
                {props.tabs.map((tab, i) => (
                    <button key={i}
                            className={i === activeTab ? 'tab-active' : ""}
                            onClick={() => {
                                setActiveTab(i)
                            }}>
                        {tab.label}
                    </button>
                ))}
            </div>
            {activeTab !== undefined &&
                <div className={'tab-content'}>
                    {props.tabs.filter((_, i) => i === activeTab)[0].content}
                </div>
            }
        </div>
    );
};

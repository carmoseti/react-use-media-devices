import React, {FunctionComponent, LegacyRef, MutableRefObject, useEffect, useRef} from 'react'
import {useMediaDevices} from "./lib"

interface OwnProps {
}

type Props = OwnProps;

const App: FunctionComponent<Props> = (props) => {
    const {
        availableDevices,
        displayMediaStream,
        enumerateDevices,
        getDisplayMediaStream,
        getSupportedConstraints,
        isAvailable,
        supportedConstraints
    } = useMediaDevices()

    const videoRef: MutableRefObject<HTMLVideoElement | undefined> = useRef<HTMLVideoElement>()

    useEffect(() => {
        if (displayMediaStream && videoRef) {
            if (videoRef.current) {
                //@ts-ignore
                videoRef.current.srcObject = displayMediaStream
                console.log(displayMediaStream)
            }
        }
    }, [displayMediaStream, videoRef])

    return (
        <div>
            <p>Is browser media devices available? {isAvailable ?
                <span className={'positive'}>YES</span> : <span className={'negative'}>NO</span>}
            </p>
            <p>
                <button onClick={() => {
                    enumerateDevices()
                }}>Enumerate devices
                </button>
            </p>
            {availableDevices &&
                <div>
                    <h3>Available Devices</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Device Id</th>
                            <th>Group Id</th>
                            <th>Kind</th>
                            <th>Label</th>
                        </tr>
                        </thead>
                        <tbody>
                        {availableDevices.map((device) => (
                            <tr>
                                <td>{device.deviceId}</td>
                                <td>{device.groupId}</td>
                                <td>{device.kind}</td>
                                <td>{device.label}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            }
            <p>
                <button onClick={() => {
                    getSupportedConstraints()
                }}>Get Supported Constraints
                </button>
            </p>
            {supportedConstraints &&
                <div>
                    <h3>Supported Constraints</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(supportedConstraints).map(([k, v]) => (
                            <tr>
                                <td>{k}</td>
                                <td>
                                    {v ? <span className={"positive"}>YES</span> :
                                        <span className={"negative"}>NO</span>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            }
            <p>
                <button onClick={() => {
                    getDisplayMediaStream()
                }}>Get Display Media
                </button>
            </p>
            {displayMediaStream &&
                <video ref={videoRef as LegacyRef<HTMLVideoElement>}
                       autoPlay={true}
                       controls={true}
                       style={{width: 750, height: 500, background: '#000'}}/>
            }
        </div>
    );
};

export default App;

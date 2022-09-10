import React, {FunctionComponent, LegacyRef, MutableRefObject, useEffect, useRef, useState} from 'react'
import {useMediaDevices} from "./lib"
import {Tabs} from "./components/Tabs";

interface OwnProps {
}

type Props = OwnProps;

const App: FunctionComponent<Props> = (props) => {
    const {
        audioInputDevices,
        audioOutputDevices,
        availableDevices,
        enumerateDevices,
        getSupportedConstraints,
        isAvailable,
        screenShareStream,
        selectedAudioInputDevice,
        selectedAudioOutputDevice,
        selectedVideoInputDevice,
        startScreenShare,
        startUserMedia,
        stopScreenShare,
        stopUserMedia,
        supportedConstraints,
        userMediaStream,
        videoInputDevices
    } = useMediaDevices()

    const [selectedAudioInputDeviceId, setSelectedAudioInputDeviceId] = useState<string>()
    const [selectedVideoInputDeviceId, setSelectedVideoInputDeviceId] = useState<string>()

    const screenShareVideoRef: MutableRefObject<HTMLVideoElement | undefined> = useRef<HTMLVideoElement>()
    const userMediaVideoRef: MutableRefObject<HTMLVideoElement | undefined> = useRef<HTMLVideoElement>()

    useEffect(() => {
        if (screenShareStream && screenShareVideoRef) {
            if (screenShareVideoRef.current) {
                (screenShareVideoRef.current as HTMLVideoElement).srcObject = screenShareStream
            }
        }
    }, [screenShareStream, screenShareVideoRef])

    useEffect(() => {
        if (userMediaStream && userMediaVideoRef) {
            if (userMediaVideoRef.current) {
                (userMediaVideoRef.current as HTMLVideoElement).srcObject = userMediaStream
            }
        }
    }, [userMediaStream, userMediaVideoRef])

    useEffect(() => {
        if (selectedAudioInputDeviceId || selectedVideoInputDeviceId) {
            if (userMediaStream) {
                startUserMedia({
                    audio: selectedAudioInputDeviceId ? {
                        deviceId: selectedAudioInputDeviceId
                    } : true,
                    video: selectedVideoInputDeviceId ? {
                        deviceId: selectedVideoInputDeviceId
                    } : true,
                })
            }
        }
    }, [selectedAudioInputDeviceId, selectedVideoInputDeviceId])

    return (
        <div>
            <p>Is browser media devices available? {isAvailable ?
                <span className={'positive'}>YES</span> : <span className={'negative'}>NO</span>}
            </p>
            <Tabs tabs={[
                {
                    label: "Devices List",
                    content: (
                        <React.Fragment>
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
                                        {availableDevices.map((device, i) => (
                                            <tr key={i}>
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
                            {audioInputDevices &&
                                <div>
                                    <h3>Audio Input Devices</h3>
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
                                        {audioInputDevices.map((device, i) => (
                                            <tr key={i}>
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
                            {audioOutputDevices &&
                                <div>
                                    <h3>Audio Output Devices</h3>
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
                                        {audioOutputDevices.map((device, i) => (
                                            <tr key={i}>
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
                            {videoInputDevices &&
                                <div>
                                    <h3>Video Input Devices</h3>
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
                                        {videoInputDevices.map((device, i) => (
                                            <tr key={i}>
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
                        </React.Fragment>
                    )
                },
                {
                    label: "Supported Constraints",
                    content: (
                        <React.Fragment>
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
                                            <tr key={k}>
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
                        </React.Fragment>
                    )
                },
                {
                    label: 'Screen Sharing and User Media',
                    content: (
                        <React.Fragment>
                            <div style={{
                                display: "inline-block",
                                width: '50%',
                                height: '100%',
                                padding: 8
                            }}>
                                {!screenShareStream &&
                                    <p>
                                        <button onClick={() => {
                                            startScreenShare()
                                        }}>Start Screen Share!
                                        </button>
                                    </p>
                                }
                                {screenShareStream &&
                                    <div>
                                        <p>
                                            <button onClick={() => {
                                                stopScreenShare()
                                            }}>Stop Screen Share!
                                            </button>
                                        </p>
                                        <video ref={screenShareVideoRef as LegacyRef<HTMLVideoElement>}
                                               autoPlay={true}
                                               controls={true}
                                               style={{width: '100%', height: 500, background: '#000'}}/>
                                    </div>
                                }
                            </div>
                            <div style={{
                                display: "inline-block",
                                width: '50%',
                                height: '100%',
                                padding: 8
                            }}>
                                {audioInputDevices &&
                                    <div>
                                        <span>Audio Input</span>&nbsp;
                                        <select value={selectedAudioInputDevice?.deviceId}
                                                onChange={(...args) => {
                                                    setSelectedAudioInputDeviceId(args[0].target.value)
                                                }}>
                                            {audioInputDevices.map((a) => (
                                                <option key={a.deviceId} value={a.deviceId}>{a.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                }
                                {videoInputDevices &&
                                    <div>
                                        <span>Video Input</span>&nbsp;
                                        <select value={selectedVideoInputDevice?.deviceId}
                                                onChange={(...args) => {
                                                    setSelectedVideoInputDeviceId(args[0].target.value)
                                                }}>
                                            {videoInputDevices.map((a) => (
                                                <option key={a.deviceId} value={a.deviceId}>{a.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                }
                                {!userMediaStream &&
                                    <p>
                                        <button onClick={() => {
                                            startUserMedia({
                                                audio: selectedAudioInputDeviceId ? {
                                                    deviceId: selectedAudioInputDeviceId
                                                } : true,
                                                video: selectedVideoInputDeviceId ? {
                                                    deviceId: selectedVideoInputDeviceId
                                                } : true,
                                            })
                                        }}>Start User Media!
                                        </button>
                                    </p>
                                }
                                {userMediaStream &&
                                    <div>
                                        <p>
                                            <button onClick={() => {
                                                stopUserMedia()
                                            }}>Stop User Media!
                                            </button>
                                        </p>
                                        <video ref={userMediaVideoRef as LegacyRef<HTMLVideoElement>}
                                               autoPlay={true}
                                               controls={true}
                                               style={{width: '100%', height: 500, background: '#000'}}
                                               className={'user-media-video'}
                                        />
                                    </div>
                                }
                            </div>
                        </React.Fragment>
                    )
                }
            ]}/>
        </div>
    );
};

export default App;

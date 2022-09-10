import {useCallback, useEffect, useState} from "react"

export type EnumerateDevicesSuccessCallback = (devices: Array<MediaDeviceInfo>) => void
export type ErrorCallback = (error: Error) => void
export type StartScreenShareSuccessCallback = (screenShareStream: MediaStream) => void
export type StartUserMediaSuccessCallback = (userMediaStream: MediaStream) => void

export type UseMediaDevices = {
    audioInputDevices?: Array<MediaDeviceInfo>
    audioOutputDevices?: Array<MediaDeviceInfo>
    availableDevices?: Array<MediaDeviceInfo>
    enumerateDevices: (successCallback ?: EnumerateDevicesSuccessCallback, errorCallback ?: ErrorCallback) => void
    getSupportedConstraints: () => void
    isAvailable?: boolean
    screenShareStream?: MediaStream
    selectedAudioInputDevice?: MediaDeviceInfo
    /*selectedAudioOutputDevice?: MediaDeviceInfo*/
    selectedVideoInputDevice?: MediaDeviceInfo
    startScreenShare: (constraints ?: DisplayMediaStreamConstraints, successCallback ?: StartScreenShareSuccessCallback, errorCallback ?: ErrorCallback) => void
    startUserMedia: (constraints: MediaStreamConstraints, successCallback ?: StartUserMediaSuccessCallback, errorCallback ?: ErrorCallback) => void
    stopScreenShare: () => void
    stopUserMedia: () => void
    supportedConstraints?: MediaTrackSupportedConstraints
    userMediaStream?: MediaStream
    videoInputDevices?: Array<MediaDeviceInfo>
}

export const useMediaDevices = (): UseMediaDevices => {
    const [audioInputDevices, setAudioInputDevices] = useState<Array<MediaDeviceInfo>>()
    const [audioOutputDevices, setAudioOutputDevices] = useState<Array<MediaDeviceInfo>>()
    const [availableDevices, setAvailableDevices] = useState<Array<MediaDeviceInfo>>()
    const [isAvailable, setIsAvailable] = useState<boolean>()
    const [mediaDevices, setMediaDevices] = useState<MediaDevices>()
    const [screenShareStream, setScreenShareStream] = useState<MediaStream>()
    const [selectedAudioInputDevice, setSelectedAudioInputDevice] = useState<MediaDeviceInfo>()
    /*const [selectedAudioOutputDevice, setSelectedAudioOutputDevice] = useState<MediaDeviceInfo>()*/
    const [selectedVideoInputDevice, setSelectedVideoInputDevice] = useState<MediaDeviceInfo>()
    const [supportedConstraints, setSupportedConstraints] = useState<MediaTrackSupportedConstraints>()
    const [userMediaStream, setUserMediaStream] = useState<MediaStream>()
    const [videoInputDevices, setVideoInputDevices] = useState<Array<MediaDeviceInfo>>()

    const enumerateDevices = useCallback((successCallback?: EnumerateDevicesSuccessCallback, errorCallback?: ErrorCallback) => {
        if (mediaDevices) {
            mediaDevices.enumerateDevices()
                .then((...args) => {
                    if (successCallback) {
                        successCallback(args[0])
                    }
                    setAvailableDevices(args[0])
                })
                .catch((...args) => {
                    if (errorCallback) {
                        errorCallback(args[0])
                    }
                    console.error(`useMediaDevices.enumerateDevices() `, args)
                })
        } else {
            console.error(`useMediaDevices.enumerateDevices() is not available`)
        }
    }, [mediaDevices])

    const getSupportedConstraints = useCallback(() => {
        if (mediaDevices) {
            setSupportedConstraints(mediaDevices.getSupportedConstraints())
        } else {
            console.error(`useMediaDevices.getSupportedConstraints() is not available`)
        }
    }, [mediaDevices])

    const startScreenShare = useCallback((constraints ?: DisplayMediaStreamConstraints, successCallback ?: StartScreenShareSuccessCallback, errorCallback?: ErrorCallback) => {
        if (mediaDevices) {
            mediaDevices.getDisplayMedia(constraints)
                .then((...args) => {
                    if (successCallback) {
                        successCallback(args[0])
                    }
                    setScreenShareStream(args[0])

                    // Detect when user has ended stream using native browser controls
                    args[0].getTracks().forEach((track) => {
                        track.addEventListener('ended', () => {
                            setScreenShareStream(undefined)
                        })
                        track.onended = () => {
                            setScreenShareStream(undefined)
                        }
                    })
                })
                .catch((...args) => {
                    if (errorCallback) {
                        errorCallback(args[0])
                    }
                    console.error(`useMediaDevices.startScreenShare() `, args)
                })
        } else {
            console.error(`useMediaDevices.startScreenShare() is not available`)
        }
    }, [mediaDevices])

    const startUserMedia = useCallback((constraints: MediaStreamConstraints, successCallback ?: StartUserMediaSuccessCallback, errorCallback?: ErrorCallback) => {
        if (mediaDevices) {
            mediaDevices.getUserMedia(constraints)
                .then((...args) => {
                    if (successCallback) {
                        successCallback(args[0])
                    }
                    setUserMediaStream(args[0])
                })
                .catch((...args) => {
                    if (errorCallback) {
                        errorCallback(args[0])
                    }
                    console.error(`useMediaDevices.startUserMedia() `, args)
                })
        } else {
            console.error(`useMediaDevices.startUserMedia() is not available`)
        }
    }, [mediaDevices])

    const stopScreenShare = useCallback(() => {
        if (screenShareStream) {
            screenShareStream.getTracks().forEach((track) => {
                track.stop()
                screenShareStream.removeTrack(track)
            })
            setScreenShareStream(undefined)
        } else {
            console.error(`useMediaDevices.stopScreenShare() is not available`)
        }
    }, [screenShareStream])

    const stopUserMedia = useCallback(() => {
        if (userMediaStream) {
            userMediaStream.getTracks().forEach((track) => {
                track.stop()
                userMediaStream.removeTrack(track)
            })
            setUserMediaStream(undefined)
        } else {
            console.error(`useMediaDevices.stopUserMedia() is not available`)
        }
    }, [userMediaStream])

    useEffect(() => {
        if ("mediaDevices" in navigator) {
            setIsAvailable(true)
        } else {
            setIsAvailable(false)
        }
    }, [])

    useEffect(() => {
        if (isAvailable) {
            setMediaDevices(navigator.mediaDevices)

            navigator.mediaDevices.enumerateDevices()
                .then((...args) => {
                    setAvailableDevices(args[0])
                })
                .catch((...args) => {
                    console.error(`navigator.mediaDevices.enumerateDevices() `, args)
                })
        } else {
            setMediaDevices(undefined)
        }
    }, [isAvailable])

    useEffect(() => {
        if (mediaDevices) {
            mediaDevices.ondevicechange = (...args) => {
                enumerateDevices()
            }
        }
    }, [mediaDevices])

    useEffect(() => {
        if (availableDevices) {
            setAudioInputDevices(availableDevices.filter((a) => a.kind === "audioinput"))
            setAudioOutputDevices(availableDevices.filter((a) => a.kind === "audiooutput"))
            setVideoInputDevices(availableDevices.filter((a) => a.kind === "videoinput"))
        } else {
            setAudioInputDevices(undefined)
            setAudioOutputDevices(undefined)
            setVideoInputDevices(undefined)
        }
    }, [availableDevices])

    useEffect(() => {
        if (userMediaStream && audioInputDevices) {
            userMediaStream.getAudioTracks().forEach((audioTrack) => {
                if (audioTrack.enabled) {
                    setSelectedAudioInputDevice(
                        (audioInputDevices.filter((a) => a.deviceId === audioTrack.getSettings().deviceId) ?? [])[0]
                    )
                }
            })
        } else {
            setSelectedAudioInputDevice(undefined)
        }
    }, [audioInputDevices, userMediaStream])

    useEffect(() => {
        if (userMediaStream && videoInputDevices) {
            userMediaStream.getVideoTracks().forEach((videoTrack) => {
                if (videoTrack.enabled) {
                    setSelectedVideoInputDevice(
                        (videoInputDevices.filter((a) => a.deviceId === videoTrack.getSettings().deviceId) ?? [])[0]
                    )
                }
            })
        } else {
            setSelectedVideoInputDevice(undefined)
        }
    }, [videoInputDevices, userMediaStream])

    return {
        audioInputDevices,
        audioOutputDevices,
        availableDevices,
        enumerateDevices,
        getSupportedConstraints,
        isAvailable,
        screenShareStream,
        selectedAudioInputDevice,
        /*selectedAudioOutputDevice,*/
        selectedVideoInputDevice,
        startScreenShare,
        startUserMedia,
        stopScreenShare,
        stopUserMedia,
        supportedConstraints,
        userMediaStream,
        videoInputDevices
    }
}
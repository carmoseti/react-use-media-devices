import {useCallback, useEffect, useState} from "react"

export type EnumerateDevicesSuccessCallback = (devices: Array<MediaDeviceInfo>) => void
export type ErrorCallback = (error: Error) => void
export type StartScreenShareSuccessCallback = (screenShareStream: MediaStream) => void
export type StartUserMediaSuccessCallback = (userMediaStream: MediaStream) => void

export type UseMediaDevices = {
    availableDevices?: Array<MediaDeviceInfo>
    enumerateDevices: (successCallback ?: EnumerateDevicesSuccessCallback, errorCallback ?: ErrorCallback) => void
    getSupportedConstraints: () => void
    isAvailable?: boolean
    screenShareStream?: MediaStream
    startScreenShare: (constraints ?: DisplayMediaStreamConstraints, successCallback ?: StartScreenShareSuccessCallback, errorCallback ?: ErrorCallback) => void
    startUserMedia: (constraints: MediaStreamConstraints, successCallback ?: StartUserMediaSuccessCallback, errorCallback ?: ErrorCallback) => void
    stopScreenShare: () => void
    stopUserMedia: () => void
    supportedConstraints?: MediaTrackSupportedConstraints
    userMediaStream?: MediaStream
}

export const useMediaDevices = (): UseMediaDevices => {
    const [availableDevices, setAvailableDevices] = useState<Array<MediaDeviceInfo>>()
    const [isAvailable, setIsAvailable] = useState<boolean>()
    const [mediaDevices, setMediaDevices] = useState<MediaDevices>()
    const [screenShareStream, setScreenShareStream] = useState<MediaStream>()
    const [supportedConstraints, setSupportedConstraints] = useState<MediaTrackSupportedConstraints>()
    const [userMediaStream, setUserMediaStream] = useState<MediaStream>()

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

    return {
        availableDevices,
        enumerateDevices,
        getSupportedConstraints,
        isAvailable,
        screenShareStream,
        startScreenShare,
        startUserMedia,
        stopScreenShare,
        stopUserMedia,
        supportedConstraints,
        userMediaStream
    }
}
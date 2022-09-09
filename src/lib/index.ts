import {useCallback, useEffect, useState} from "react";

export type EnumerateDevicesSuccessCallback = (devices: Array<MediaDeviceInfo>) => void
export type ErrorCallback = (error: Error) => void
export type GetDisplayMediaStreamSuccessCallback = (displayMediaStream: MediaStream) => void

export type UseMediaDevices = {
    availableDevices?: Array<MediaDeviceInfo>
    displayMediaStream?: MediaStream
    enumerateDevices: (successCallback ?: EnumerateDevicesSuccessCallback, errorCallback ?: ErrorCallback) => void
    getDisplayMediaStream: (constraints ?: DisplayMediaStreamConstraints, successCallback ?: GetDisplayMediaStreamSuccessCallback, errorCallback ?: ErrorCallback) => void
    getSupportedConstraints: () => void
    isAvailable?: boolean
    supportedConstraints?: MediaTrackSupportedConstraints
}

export const useMediaDevices = (): UseMediaDevices => {
    const [availableDevices, setAvailableDevices] = useState<Array<MediaDeviceInfo>>()
    const [displayMediaStream, setDisplayMediaStream] = useState<MediaStream>()
    const [isAvailable, setIsAvailable] = useState<boolean>()
    const [mediaDevices, setMediaDevices] = useState<MediaDevices>()
    const [supportedConstraints, setSupportedConstraints] = useState<MediaTrackSupportedConstraints>()

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

    const getDisplayMediaStream = useCallback((constraints ?: DisplayMediaStreamConstraints, successCallback ?: GetDisplayMediaStreamSuccessCallback, errorCallback?: ErrorCallback) => {
        if (mediaDevices) {
            mediaDevices.getDisplayMedia(constraints)
                .then((...args) => {
                    if (successCallback) {
                        successCallback(args[0])
                    }
                    setDisplayMediaStream(args[0])
                })
                .catch((...args) => {
                    if (errorCallback) {
                        errorCallback(args[0])
                    }
                    console.error(`useMediaDevices.getDisplayMediaStream() `, args)
                })
        } else {
            console.error(`useMediaDevices.getDisplayMediaStream() is not available`)
        }
    }, [mediaDevices])

    const getSupportedConstraints = useCallback(() => {
        if (mediaDevices) {
            setSupportedConstraints(mediaDevices.getSupportedConstraints())
        } else {
            console.error(`useMediaDevices.getSupportedConstraints() is not available`)
        }
    }, [mediaDevices])

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

    return {
        availableDevices,
        displayMediaStream,
        enumerateDevices,
        getDisplayMediaStream,
        getSupportedConstraints,
        isAvailable,
        supportedConstraints
    }
}
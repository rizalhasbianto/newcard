import { useCallback, useRef, useState, useMemo } from 'react';

export function useToast() {
    const [toastMessage, setToastMessage] = useState("")
    const [toastStatus, setToastStatus] = useState("");

    const handleStatus = useCallback(
        (status) => {
            setToastStatus(status)
            setTimeout(() => {
                setToastStatus("")
            }, 10000);
        },[]
    )

    const handleMessage = useCallback(
        (message) => {
            setToastMessage(message)
        },[]
    )

    return {
        toastStatus,
        toastMessage,
        handleStatus,
        handleMessage
      };
}
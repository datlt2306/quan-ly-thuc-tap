import { useState, useEffect } from 'react';

export function useMobileDetect() {
    const [isMobile, setIsMobile] = useState(false);

    // check for breakpoint
    const handleWindowSizeChange = () => {
        setIsMobile(window.innerWidth <= 768);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return isMobile;
}
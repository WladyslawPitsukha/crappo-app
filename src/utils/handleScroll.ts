import { useEffect, useState } from "react";

const HandleScroll = () => {
    const [activeSection, setActiveSection] = useState<string>("Home");

    useEffect(() => {
        const handleScrollElem = () => {
            const sections = document.querySelectorAll('section');
            let currentSec = "Home";
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 50) {
                    currentSec = section.getAttribute('id') || 'Home';
                }
            });
            setActiveSection(currentSec);
        };

        window.addEventListener('scroll', handleScrollElem);
        return () => window.removeEventListener('scroll', handleScrollElem);
    }, []);

    return activeSection;
};

export default HandleScroll;
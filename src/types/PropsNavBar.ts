export type PropsNavBar = {
    title: string;
    onClick: () => any;
}

export function SectionScroll(id: string) {
    const section = document.getElementById(id);

    section?.scrollIntoView({behavior: 'smooth'});
}

export const propsNavBar: PropsNavBar[] = [
    {
        title: "Products",
        onClick: () => SectionScroll("Products")
    },
    {
        title: "Features",
        onClick: () => SectionScroll("Features")
    },
    {
        title: "About",
        onClick: () => SectionScroll("About")
    },
    {
        title: "Contact",
        onClick: () => SectionScroll("Contact")
    },
];
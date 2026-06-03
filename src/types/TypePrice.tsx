export type TypePrice = {
    price: () => React.ReactNode;
    title: string;
};

export const ownPriceArray: TypePrice[] = [
    {
        price: () => <span></span>,
        title: "Trends"
    },
    {
        price: () => <span></span>,
        title: "Total amount"
    },
    {
        price: () => <span></span>,
        title: "High"
    },
    {
        price: () => <span></span>,
        title: "Low"
    },
];
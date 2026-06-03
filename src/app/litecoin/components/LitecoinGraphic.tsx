import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DataPoint {
    date: string;
    price: number;
}

const LitecoinGraphic: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        const fetchData= async () => {
            const newData = Array.from({length: 30}, (_, index) => {
                const date = new Date();
                date.setDate(date.getDate() - index);

                return {
                    date: date.toISOString().split('T')[0],
                    price: Math.floor(Math.random() * 100) + 50
                }
            }).reverse();

            setData(newData);
        }
        fetchData();

        const intervalId = setInterval(fetchData, 3600000);

        return () => clearInterval(intervalId);
    }, [])

    return(
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#345D9D" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default LitecoinGraphic;
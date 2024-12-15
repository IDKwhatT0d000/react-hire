import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { db } from "../../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Landingbar() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollection = collection(db, "Users");
        const studentsQuery = query(usersCollection, where("type", "==", "student"));
        const snapshot = await getDocs(studentsQuery);
        const data = snapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            name: userData.name || "Unknown",
            rating: userData.rating || 0,
          };
        });
        setChartData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    rating: {
      label: "Rating",
      color: "#3b82f6",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>Ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <RechartsBarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border p-2 shadow-md">
                        <p className="font-bold">{payload[0].payload.name}</p>
                        <p>{`${chartConfig.rating.label}: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="rating" fill={chartConfig.rating.color} radius={8} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-gray-500">
          Recent users
        </div>
      </CardFooter>
    </Card>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { DataTable } from "@/components/earnings/data-table";

import { columns } from "@/components/earnings/columns";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function EarningsDashboard() {
  // Calculate monthly earnings

  const data = useQuery(api.invoices.getInvoicesWithItems);

  const clientEarnings = useMemo(() => {
    if (!data) return [];
    const earnings = data.reduce(
      (acc, invoice) => {
        const clientName = invoice.clientName;
        const total = invoice.items.reduce(
          (sum, item) => sum + item.rate * item.quantity,
          0,
        );

        const existingClient = acc.find((ce) => ce.client === clientName);
        if (existingClient) {
          existingClient.total += total;
        } else {
          acc.push({ client: clientName, total });
        }

        return acc;
      },
      [] as { client: string; total: number }[],
    );

    // Sort by total earnings in descending order
    return earnings.sort((a, b) => b.total - a.total);
  }, [data]);
  const invoices = useMemo(() => {
    if (!data) return [];
    return data
      .map((a) => {
        return {
          amount: a.items.reduce(
            (sum, item) => sum + item.rate * item.quantity,
            0,
          ),
          date: a.date,
          status: a.status,
        };
      })
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 10);
  }, [data]);

  const monthlyEarnings = useMemo(() => {
    if (!data) return Array(12).fill(0);

    return data.reduce((acc, invoice) => {
      const month = new Date(invoice.date).getMonth();
      const total = invoice.items.reduce(
        (sum, item) => sum + item.rate * item.quantity,
        0,
      );
      acc[month] = (acc[month] || 0) + total;
      return acc;
    }, Array(12).fill(0));
  }, [data]);

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const lineChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Monthly Earnings",
        data: monthlyEarnings,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Calculate earnings by client

  const barChartData = {
    labels: clientEarnings.map((ce) => ce.client.toUpperCase()),
    datasets: [
      {
        label: "Earnings by Client",
        data: clientEarnings.map((ce) => ce.total),
        backgroundColor: "rgba(53, 162, 0, 0.9)",
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Earnings Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Monthly Earnings Trend</h2>
          <Line data={lineChartData} />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Earnings by Client</h2>
          <Bar data={barChartData} />
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
        <DataTable columns={columns} data={invoices || []} />
      </Card>
    </div>
  );
}

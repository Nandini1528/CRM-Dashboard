"use client";

import { useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useCustomers } from "@/hooks/useCustomers";
import type { Customer } from "@/types/customer";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

function useDashboardStats(customers: Customer[]) {
  return useMemo(() => {
    const activeCount = customers.filter((c) => c.status === "Active").length;
    const inactiveCount = customers.length - activeCount;

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const newThisMonth = customers.filter((c) =>
      c.lastContactDate?.startsWith(currentMonthKey)
    ).length;

    const monthCounts: Record<string, number> = {};
    customers.forEach((c) => {
      const month = c.lastContactDate?.slice(0, 7);
      if (!month) return;
      monthCounts[month] = (monthCounts[month] ?? 0) + 1;
    });
    const sortedMonths = Object.keys(monthCounts).sort().slice(-6);
    const monthlyLabels = sortedMonths.map((m) => {
      const [year, month] = m.split("-");
      return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
        month: "short",
      });
    });
    const monthlyValues = sortedMonths.map((m) => monthCounts[m]);

    return {
      total: customers.length,
      activeCount,
      inactiveCount,
      newThisMonth,
      monthlyLabels,
      monthlyValues,
    };
  }, [customers]);
}

export function DashboardOverview() {
  const { data: customers = [], isLoading } = useCustomers();
  const stats = useDashboardStats(customers);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex flex-col gap-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3">
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex flex-col gap-4">
      <h1 className="text-xl font-medium text-slate-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-600 rounded-lg p-4">
          <p className="text-sm text-blue-100">Total customers</p>
          <p className="text-2xl font-medium text-white mt-1">{stats.total}</p>
        </div>
        <StatCard label="Active" value={stats.activeCount} />
        <StatCard label="Inactive" value={stats.inactiveCount} />
        <StatCard label="New this month" value={stats.newThisMonth} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-3">Customers added by month</p>
          <div className="relative h-56">
            <Bar
              data={{
                labels: stats.monthlyLabels,
                datasets: [
                  {
                    data: stats.monthlyValues,
                    backgroundColor: "#2a78d6",
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground mb-3 self-start">Status</p>
          <div className="relative h-40 w-full">
            <Doughnut
              data={{
                labels: ["Active", "Inactive"],
                datasets: [
                  {
                    data: [stats.activeCount, stats.inactiveCount],
                    backgroundColor: ["#1baf7a", "#c3c2b7"],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#1baf7a]" />
              Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#c3c2b7]" />
              Inactive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-medium mt-1">{value}</p>
    </div>
  );
}
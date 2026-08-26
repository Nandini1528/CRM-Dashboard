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
  Legend,
} from "chart.js";
import { useCustomers } from "@/hooks/useCustomers";
import type { Customer } from "@/types/customer";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function useDashboardStats(customers: Customer[]) {
  return useMemo(() => {
    const activeCount = customers.filter(
      (customer) => customer.status === "Active"
    ).length;

    const inactiveCount = customers.length - activeCount;

    const now = new Date();

    const currentMonthKey = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    const contactedThisMonth = customers.filter((customer) =>
      customer.lastContactDate?.startsWith(currentMonthKey)
    ).length;

    const activePercentage =
      customers.length > 0
        ? Math.round((activeCount / customers.length) * 1000) / 10
        : 0;

    const inactivePercentage =
      customers.length > 0
        ? Math.round((inactiveCount / customers.length) * 1000) / 10
        : 0;

    const contactedPercentage =
      customers.length > 0
        ? Math.round((contactedThisMonth / customers.length) * 1000) / 10
        : 0;

    // Group customer contacts by month
    const monthCounts: Record<string, number> = {};

    customers.forEach((customer) => {
      const month = customer.lastContactDate?.slice(0, 7);

      if (!month) return;

      monthCounts[month] = (monthCounts[month] ?? 0) + 1;
    });

    const sortedMonths = Object.keys(monthCounts)
      .sort()
      .slice(-6);

    const monthlyLabels = sortedMonths.map((month) => {
      const [year, monthNumber] = month.split("-");

      return new Date(
        Number(year),
        Number(monthNumber) - 1
      ).toLocaleDateString("en-US", {
        month: "short",
      });
    });

    const monthlyValues = sortedMonths.map(
      (month) => monthCounts[month]
    );

    return {
      total: customers.length,
      activeCount,
      inactiveCount,
      contactedThisMonth,
      activePercentage,
      inactivePercentage,
      contactedPercentage,
      monthlyLabels,
      monthlyValues,
    };
  }, [customers]);
}

export function DashboardOverview() {
  const { data: customers = [], isLoading } = useCustomers();

  const stats = useDashboardStats(customers);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="min-h-full bg-background p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Dashboard
          </h1>

          <p className="text-sm text-muted-foreground">
            Overview of your customer activity and status.
          </p>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          <StatCard
            label="Total customers"
            value={stats.total}
            description="All customers"
            featured
          />

          <StatCard
            label="Active"
            value={stats.activeCount}
            description={`${stats.activePercentage}% of total`}
          />

          <StatCard
            label="Inactive"
            value={stats.inactiveCount}
            description={`${stats.inactivePercentage}% of total`}
          />

          <StatCard
            label="Contacted this month"
            value={stats.contactedThisMonth}
            description={`${stats.contactedPercentage}% of total`}
          />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
          {/* Customer engagement */}
          <div className="rounded-xl border bg-card p-3.5 shadow-sm sm:p-4 md:p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Customer engagement
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Customer contacts over the last 6 months
                </p>
              </div>

              <div className="hidden rounded-md bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground sm:block">
                Last 6 months
              </div>
            </div>

            <div className="relative h-56 w-full sm:h-64">
              {stats.monthlyValues.length > 0 ? (
                <Bar
                  data={{
                    labels: stats.monthlyLabels,
                    datasets: [
                      {
                        data: stats.monthlyValues,
                        backgroundColor: "#3b82f6",
                        borderRadius: 6,
                        borderSkipped: false,
                        barPercentage: 0.55,
                        categoryPercentage: 0.7,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        displayColors: false,
                        callbacks: {
                          label: (context) =>
                            ` ${context.parsed.y ?? 0} contacts`,
                        },
                      },
                    },

                    scales: {
                      y: {
                        beginAtZero: true,
                        border: {
                          display: false,
                        },
                        grid: {
                          color: "rgba(148, 163, 184, 0.15)",
                        },
                        ticks: {
                          precision: 0,
                          color: "#94a3b8",
                          font: {
                            size: 11,
                          },
                        },
                      },

                      x: {
                        border: {
                          display: false,
                        },
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: "#94a3b8",
                          font: {
                            size: 11,
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No contact data available.
                </div>
              )}
            </div>
          </div>

          {/* Customer status */}
          <div className="rounded-xl border bg-card p-3.5 shadow-sm sm:p-4 md:p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-foreground">
                Customer status
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Current customer distribution
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-44 w-full max-w-[200px] sm:h-48 sm:max-w-[220px]">
                <Doughnut
                  data={{
                    labels: ["Active", "Inactive"],
                    datasets: [
                      {
                        data: [
                          stats.activeCount,
                          stats.inactiveCount,
                        ],
                        backgroundColor: ["#22c55e", "#64748b"],
                        borderWidth: 0,
                        hoverOffset: 4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "72%",

                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        displayColors: false,
                        callbacks: {
                          label: (context) => {
                            const value = context.parsed;
                            const percentage =
                              stats.total > 0
                                ? ((value / stats.total) * 100).toFixed(1)
                                : "0";

                            return ` ${value} (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                />

                {/* Center value */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold text-foreground">
                    {stats.total}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    customers
                  </span>
                </div>
              </div>

              {/* Status breakdown */}
              <div className="mt-4 w-full space-y-3">
                <StatusRow
                  label="Active"
                  value={stats.activeCount}
                  percentage={stats.activePercentage}
                  indicatorClass="bg-green-500"
                />

                <StatusRow
                  label="Inactive"
                  value={stats.inactiveCount}
                  percentage={stats.inactivePercentage}
                  indicatorClass="bg-slate-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom summary */}
        <section className="rounded-xl border bg-card p-3.5 shadow-sm sm:p-4 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Customer overview
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {stats.activeCount} active customers are currently in your
                customer base.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>
                {stats.activePercentage}% active
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
  featured = false,
}: {
  label: string;
  value: number;
  description: string;
  featured?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border p-3.5 shadow-sm transition-shadow hover:shadow-md sm:p-4 md:p-5",
        featured
          ? "border-blue-600 bg-blue-600"
          : "bg-card",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className={
            featured
              ? "text-xs font-medium text-blue-100"
              : "text-xs font-medium text-muted-foreground"
          }
        >
          {label}
        </p>

        <span
          className={
            featured
              ? "h-2 w-2 shrink-0 rounded-full bg-blue-200"
              : "h-2 w-2 shrink-0 rounded-full bg-muted-foreground/30"
          }
        />
      </div>

      <p
        className={
          featured
            ? "mt-3 text-xl font-semibold text-white sm:text-2xl md:text-3xl"
            : "mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl"
        }
      >
        {value}
      </p>

      <p
        className={
          featured
            ? "mt-1 text-xs text-blue-100"
            : "mt-1 text-xs text-muted-foreground"
        }
      >
        {description}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  percentage,
  indicatorClass,
}: {
  label: string;
  value: number;
  percentage: number;
  indicatorClass: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${indicatorClass}`}
        />

        <span className="text-sm text-foreground/90">{label}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">
          {value}
        </span>

        <span className="w-12 text-right text-xs text-muted-foreground">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <main className="min-h-full bg-background p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-muted sm:h-32"
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="h-72 animate-pulse rounded-xl bg-muted sm:h-80" />
          <div className="h-72 animate-pulse rounded-xl bg-muted sm:h-80" />
        </div>

        {/* Bottom */}
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
      </div>
    </main>
  );
}
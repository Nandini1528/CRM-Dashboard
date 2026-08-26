import { Customer, CustomerStatus } from "@/types/customer";

const FIRST_NAMES = [
  "Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah",
  "Ian", "Julia", "Kevin", "Laura", "Marcus", "Nina", "Oscar", "Priya",
  "Quinn", "Rosa", "Sam", "Tara", "Umar", "Vera", "Will", "Ximena", "Yusuf", "Zoe",
];
const LAST_NAMES = [
  "Green", "Ross", "Davis", "Patel", "Kim", "Nguyen", "Garcia", "Smith",
  "Johnson", "Brown", "Lee", "Martinez", "Clark", "Lewis", "Walker", "Hall",
];
const COMPANIES = [
  "Acme Corp", "Globex", "Stark Industries", "Innovatech", "Umbrella Co",
  "Initech", "Hooli", "Wayne Enterprises", "Wonka Industries", "Cyberdyne Systems",
];
const NOTES_SAMPLES = [
  "Met at industry conference. Interested in enterprise plan.",
  "Requested pricing follow-up next quarter.",
  "Long-time customer, low support volume.",
  "Escalated a billing issue last month, resolved.",
  "Evaluating alternatives, at-risk of churn.",
  "Recently upgraded to premium tier.",
  "",
];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function generateIndianPhone(rand: () => number): string {
  const firstDigit = pick([6, 7, 8, 9], rand);
  const rest = Array.from({ length: 9 }, () => Math.floor(rand() * 10)).join("");
  const number = `${firstDigit}${rest}`;
  return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
}

function generateCustomers(count: number): Customer[] {
  const rand = mulberry32(42);
  const customers: Customer[] = [];

  for (let i = 1; i <= count; i++) {
    const first = pick(FIRST_NAMES, rand);
    const last = pick(LAST_NAMES, rand);
    const company = pick(COMPANIES, rand);
    const status: CustomerStatus = rand() > 0.3 ? "Active" : "Inactive";

    const daysAgo = Math.floor(rand() * 730);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const emailHandle = `${first.toLowerCase()}.${last.toLowerCase()}${i}`;

    customers.push({
      id: `cust_${i}`,
      name: `${first} ${last}`,
      email: `${emailHandle}@${company.toLowerCase().replace(/\s+/g, "")}.com`,
      phone: generateIndianPhone(rand),
      company,
      status,
      lastContactDate: date.toISOString().split("T")[0],
      notes: pick(NOTES_SAMPLES, rand),
    });
  }

  return customers;
}

export const mockCustomers: Customer[] = generateCustomers(150);
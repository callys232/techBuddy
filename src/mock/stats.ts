export type StatColor = "teal" | "amber" | "coral";

export interface Stat {
  value: number;
  label: string;
  suffix: string;
  color: StatColor;
}

export const STATS: Stat[] = [
  { value: 120, label: "Projects Delivered", suffix: "+", color: "teal" },
  { value: 99, label: "Uptime Guaranteed", suffix: ".9%", color: "amber" },
  { value: 14, label: "Countries Served", suffix: "", color: "teal" },
  { value: 98, label: "Client Satisfaction", suffix: "%", color: "coral" },
];

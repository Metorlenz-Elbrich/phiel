import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance",
  description:
    "PhiBrain Inc est temporairement en maintenance. / PhiBrain Inc is temporarily under maintenance.",
  robots: { index: false, follow: false },
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

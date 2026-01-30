import type { ReactNode } from "react";

export type BadgeVariant =
  | "queued"
  | "running"
  | "success"
  | "failed"
  | (string & {});

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
};

export function Badge({ variant, className, children }: BadgeProps) {
  const classes = [
    "zBadge",
    variant ? `zBadge--${variant}` : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}

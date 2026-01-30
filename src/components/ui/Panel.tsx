import type { ReactNode } from "react";

export type PanelVariant = "default" | "logs";

type PanelProps = {
  variant?: PanelVariant;
  className?: string;
  children: ReactNode;
};

export function Panel({
  variant = "default",
  className,
  children,
}: PanelProps) {
  const classes = [
    "zAdminPanel",
    variant === "logs" ? "zAdminPanel--logs" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

type PanelHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
};

export function PanelHeader({ title, subtitle, actions }: PanelHeaderProps) {
  return (
    <div className="zAdminPanel__header">
      <div>
        <div className="zAdminPanel__title">{title}</div>
        {subtitle ? (
          <div className="zAdminPanel__subtitle">{subtitle}</div>
        ) : null}
      </div>
      {actions ? <div className="zMetaRow">{actions}</div> : null}
    </div>
  );
}

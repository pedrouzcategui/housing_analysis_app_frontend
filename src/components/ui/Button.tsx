import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "link";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "secondary",
  className,
  ...props
}: ButtonProps) {
  const baseClass =
    variant === "primary"
      ? "zPrimaryBtn"
      : variant === "link"
        ? "zLinkBtn"
        : "zSecondaryBtn";

  const classes = [baseClass, className ?? ""].filter(Boolean).join(" ");

  return <button className={classes} {...props} />;
}

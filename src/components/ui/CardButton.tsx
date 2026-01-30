import type { ButtonHTMLAttributes } from "react";

type CardButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

export function CardButton({ selected, className, ...props }: CardButtonProps) {
  const classes = ["zCard", selected ? "zCard--selected" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}

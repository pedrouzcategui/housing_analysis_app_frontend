type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
  rounded?: "sm" | "md" | "lg";
};

export function Skeleton({
  className = "",
  style,
  rounded = "md",
}: SkeletonProps) {
  return (
    <div
      className={`skeleton skeleton--${rounded} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}

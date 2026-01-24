type TopBarProps = {
  title?: string;
};

export function TopBar({ title = "Menu I guess" }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="topbar__title">{title}</div>
      </div>
    </header>
  );
}

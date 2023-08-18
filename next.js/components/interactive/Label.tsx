export type LabelProps = {
  children: string | React.ReactNode;
  icon?: React.ReactNode;
};

export const Label = ({ children, icon }: LabelProps) => {
  return (
    <span>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

import type { ReactNode } from "react";
import { Grid } from "../layout/Grid";

export type GridProps = {
  className?: string;
  children: ReactNode;
};

export const GalleryGrid = ({ className = "", children }: GridProps) => {
  return (
    <Grid
      cols={3}
      className={className}
      gridClassName="gap-3 gap-y-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    >
      {children}
    </Grid>
  );
};

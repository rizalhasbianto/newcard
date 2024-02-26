import {
  Box,
  Card,
  Skeleton,
  CardContent,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export default function GridLoading({ count }) {
  const gridCount = 12 / count;
  let loop = [];
  for (let i = 0; i < count; i++) {
    loop.push(i);
  }
  return (
    <Grid container spacing={3}>
      {loop.map((item) => (
        <Grid xs={12} md={gridCount} key={item}>
          <Card>
            <CardContent>
              <Skeleton variant="rectangular" height={100} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

interface Props {
  count: number;
  isAvatar?: boolean;
}

const SkeletonLoading: React.FC<Props> = ({ count, isAvatar = false }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {Array.from(new Array(count)).map((_, index) => (
          <Box key={index} sx={{ width: "100%", my: 1, display: "flex" }}>
            {isAvatar && <Skeleton variant="circular" height={50} width={50} />}
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ flex: 1, mx: 1 }}
            />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default SkeletonLoading;

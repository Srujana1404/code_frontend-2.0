import React from 'react';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';
import { LoaderCircle } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  showIcon?: boolean;
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  showIcon = true,
  fullScreen = true,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={fullScreen ? '100vh' : '100%'}
      width="100%"
      bgcolor="background.default"
    >
      <Stack spacing={2} alignItems="center">
        {showIcon ? (
          <LoaderCircle size={40} strokeWidth={1.5} className="animate-spin" />
        ) : (
          <CircularProgress />
        )}
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoadingScreen;
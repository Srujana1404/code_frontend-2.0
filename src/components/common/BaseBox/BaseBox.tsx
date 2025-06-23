import { Box, styled } from "@mui/material";

const BaseBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
  }));
export default BaseBox;
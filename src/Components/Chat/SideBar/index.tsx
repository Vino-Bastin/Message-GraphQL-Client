import { Avatar, Box, Typography, IconButton } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import NewConversation from "./NewConversationModel";

interface Props {}

const UserProfile: React.FC = () => {
  const { data } = useSession();

  return (
    <Box
      m={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Avatar
        src={data?.user?.image as string}
        sx={{
          my: 1,
          width: "70px",
          height: "70px",
        }}
      />
      <Typography variant="body1">{data?.user?.name}</Typography>
    </Box>
  );
};

const SideBar: React.FC<Props> = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar defaultCollapsed={collapsed}>
      {/* logo and menu icon */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m={1}
      >
        <Typography>Message</Typography>
        <IconButton>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* user profile */}
      <UserProfile />

      {/* New Conversation */}
      <NewConversation />
    </Sidebar>
  );
};

export default SideBar;

import * as React from "react";
import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  AutoFixHigh as AutoFixHighIcon,
  Delete,
  Edit,
  Launch as LaunchIcon,
  MoreVert,
  Update as UpdateIcon,
} from "@mui/icons-material";

const ProposalCard = ({
  Title,
  onDelete,
  onUpdate,
  onEdit,
  Amount,
  Date,
  PositionNumber,
  subSection,
  presentationBtn,
  presentationBtnMsg,
  handleCreateProposalClick,
  handleViewPresentation,
}) => {
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const orderedSections = [
    "Personal Info",
    "Background",
    "Approach",
    "Investment",
    "Support",
    "Case Studies",
    "Challenges",
    "Scope",
    "Timeline",
    "About Us",
    "Terms",
  ];

  const getSectionData = (sectionName) => {
    const section = subSection.find((s) => s.text === sectionName);

    return section;
  };

  const moreOptionsButtonRef = useRef();

  const handleMoreOptionsClick = () => {
    setIsMoreOptionsOpen(true);
  };

  const handleMoreOptionsClose = () => {
    setIsMoreOptionsOpen(false);
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent
        sx={{
          paddingLeft: "14px",
          paddingRight: "13px",
          paddingBottom: "10px",
        }}
      >
        <CardHeader
          sx={{ paddingLeft: "0px", paddingTop: "0px" }}
          action={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  alignSelf: "flex-end",
                  color: "#757575",
                }}
              >
                {PositionNumber}
              </Typography>
              <IconButton
                aria-label="more options"
                onClick={handleMoreOptionsClick}
                ref={moreOptionsButtonRef}
              >
                <MoreVert />
              </IconButton>
            </Box>
          }
          title={
            <Box
              style={{
                maxWidth: "175px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {Title}
            </Box>
          }
          subheader={`Close Date: ${Date} Amount: AU$${numberWithCommas(
            Amount
          )}`}
        />
        <Menu
          id="more-options-menu"
          anchorEl={moreOptionsButtonRef.current}
          open={isMoreOptionsOpen}
          onClose={handleMoreOptionsClose}
        >
          <MenuItem onClick={onEdit}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem onClick={onUpdate}>
            <ListItemIcon>
              <UpdateIcon />
            </ListItemIcon>
            <ListItemText primary="Update Presentation" />
          </MenuItem>
          <MenuItem onClick={onDelete}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
        <Typography
          variant="body1"
          color="text.parimary"
          paddingBottom={1}
          style={{ textDecoration: "underline" }}
        >
          Key Sections:
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={6}
            >
              {orderedSections
                .slice(0, orderedSections.length / 2)
                .map((sectionName) => {
                  const section = getSectionData(sectionName);
                  if (!section) {
                    return null; // Skip rendering if the section is undefined
                  }

                  return (
                    <Typography
                      key={sectionName}
                      variant="body2"
                      color={
                        section.status === "Done"
                          ? "green"
                          : section.status === "InProgress"
                          ? "#CC5500"
                          : section.status === "Cancelled"
                          ? "grey"
                          : "#e2e2e2"
                      }
                      style={
                        section.status === "Cancelled"
                          ? {
                              paddingBottom: "10px",
                              textDecoration: "line-through",
                            }
                          : { paddingBottom: "8px" }
                      }
                    >
                      {section.text}
                    </Typography>
                  );
                })}
            </Grid>
            <Grid
              item
              xs={6}
            >
              {orderedSections
                .slice(orderedSections.length / 2)
                .map((sectionName) => {
                  const section = getSectionData(sectionName);
                  if (!section) {
                    return null;
                  }

                  return (
                    <Typography
                      key={sectionName}
                      variant="body2"
                      color={
                        section.status === "Done"
                          ? "green"
                          : section.status === "InProgress"
                          ? "#CC5500"
                          : section.status === "Cancelled"
                          ? "grey"
                          : "#e2e2e2"
                      }
                      style={
                        section.status === "Cancelled"
                          ? {
                              paddingBottom: "10px",
                              textDecoration: "line-through",
                            }
                          : { paddingBottom: "8px" }
                      }
                    >
                      {section.text}
                    </Typography>
                  );
                })}
            </Grid>
          </Grid>
        </Box>
        <CardActions sx={{ justifyContent: "center", px: 0 }}>
          {presentationBtn === "create" && (
            <Button
              variant="contained"
              color="primary"
              endIcon={<AutoFixHighIcon />}
              onClick={handleCreateProposalClick}
              sx={{ px: "10px" }}
            >
              Create Presentation
            </Button>
          )}
          {presentationBtn === "loading" && (
            <Button
              variant="contained"
              color="primary"
              disabled
              endIcon={<CircularProgress size={16} />}
              sx={{ px: "10px" }}
            >
              {presentationBtnMsg}
            </Button>
          )}
          {presentationBtn === "view" && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewPresentation}
              endIcon={<LaunchIcon />}
              sx={{ px: "10px" }}
              /*

the  and the button is now a link to the presentation that shows in a modal
*/
            >
              View Presentation
            </Button>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
};
export default ProposalCard;

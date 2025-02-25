import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ProjectService } from "stellards_typescript_sdk";
import config from "../config";
import { UpdateProjectModal } from "./modals/UpdateProjectModal";


export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] =
    useState(false);
  const [projectDetails, setProjectDetails] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [projectTier, setProjectTier] = useState(null);

  const navigate = useNavigate();
  const projectService = new ProjectService(config.authToken ?? "");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.listProjects();
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchProjectsAndTiers = async () => {
      try {
        const response = await projectService.listProjects();
        const projectsWithTier = await Promise.all(
          response.data.map(async (project: any) => {
            const tierResponse = await projectService.getProjectTier(
              project.id
            );
            const currentTierResponse =
              await projectService.getProjectTierCurrent(project.id);
            return {
              ...project,
              tier: tierResponse.data,
              currentTier: currentTierResponse.data,
            };
          })
        );

        setProjects(projectsWithTier);
      } catch (error) {
        console.error("Failed to fetch projects and tiers:", error);
      }
    };
    fetchProjectsAndTiers();
  }, []);

  const handleUpdateProjectClick = (project: any) => {
    setProjectDetails(project);
    setIsUpdateProjectModalOpen(true);
  };

  const handleUpdateProject = async (event: any) => {
    event.preventDefault();
    try {
      await projectService.updateProject(projectDetails.id, projectDetails);
      alert("Project updated successfully!");
      setIsUpdateProjectModalOpen(false);
      // Reload projects to show updated data
      const updatedProjects = await projectService.listProjects();
      setProjects(updatedProjects.data);
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project. See console for details.");
    }
  };

  return (
    <>
      <UpdateProjectModal
        isOpen={isUpdateProjectModalOpen}
        onClose={() => setIsUpdateProjectModalOpen(false)}
        projectDetails={projectDetails}
        setProjectDetails={setProjectDetails}
        handleUpdateProject={handleUpdateProject}
      />

      <Typography variant="h4" component="h2" sx={{ m: 2 }}>
        Projects
      </Typography>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
                onClick={() => navigate(`/projects/${project.id}/tables`)}
              >
                <Typography variant="h5">{project.name}</Typography>
                <Typography variant="body2">{project.description}</Typography>
                {project.tier && (
                  <Typography variant="body2" color="textSecondary">
                    Tier: {project.tier.name}
                    <br />
                    Max Requests: {project.tier.maxRequests}
                    <br />
                    Tables: {project.tier.tables}
                    <br />
                    Users: {project.tier.users}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Box style={{ float: "right" }}>
                  <IconButton
                    style={{ color: "black" }}
                    onClick={() => handleUpdateProjectClick(project)}
                    aria-label="edit"
                    size="small"
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}



import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    Tabs,
    Tab,
    Grid,
    Chip,
    Card,
    CardContent,
    IconButton,
    alpha,
    useTheme,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getApplicationsByJobId } from "../../services/application";
import ApplicationCard from "../../components/ApplicationCard";

// Custom tab component with better styling
function StyledTab(props: any) {
    const theme = useTheme();
    return (
        <Tab
            {...props}
            sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                minHeight: 48,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                    color: theme.palette.primary.main,
                },
                '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
            }}
        />
    );
}

export default function JobApplication() {
    const { jobId } = useParams<{ jobId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const job = location.state?.job;
    const theme = useTheme();

    const [applications, setApplications] = useState<any[]>([]);
    const [filteredApps, setFilteredApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("all");

    const   fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await getApplicationsByJobId(Number(jobId));
            if (res.data.success) {
                setApplications(res.data.application || []);
            }
        } catch {
            toast.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    useEffect(() => {
        if (tab === "all") setFilteredApps(applications);
        else setFilteredApps(applications.filter((a) => a.status === tab));
    }, [tab, applications]);

    const handleTabChange = (__: any, newValue: string) => {
        setTab(newValue);
    };

    const handleStatusUpdate = (id: number, newStatus: string) => {
        setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
    };

    const getStatusCount = (status: string) => {
        if (status === 'all') return applications.length;
        return applications.filter(app => app.status === status).length;
    };

    const tabConfig = [
        { value: "all", label: "All", count: getStatusCount('all') },
        { value: "applied", label: "Applied", count: getStatusCount('applied') },
        { value: "shortlisted", label: "Shortlisted", count: getStatusCount('shortlisted') },
        { value: "scheduled", label: "Scheduled", count: getStatusCount('scheduled') },
        { value: "rejected", label: "Rejected", count: getStatusCount('rejected') },
        { value: "hired", label: "Hired", count: getStatusCount('hired') },
    ];

    return (
        <Box sx={{
            padding: 3,
            maxWidth: 1400,
            margin: "0 auto",
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`
        }}>
            {/* Back Button + Page Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" fontWeight="bold">
                    Job Applications
                </Typography>
            </Box>

            {/* Header Card */}
            <Card sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, yellow)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    mb: 1
                                }}
                            >
                                Applications
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                For: {job?.title || "Job Position"}
                            </Typography>
                            <Chip
                                label={`${applications.length} Total Applications`}
                                variant="outlined"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>

                        {/* Quick Stats */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={`${getStatusCount('shortlisted')} Shortlisted`}
                                size="small"
                                color="success"
                                variant="outlined"
                            />
                            <Chip
                                label={`${getStatusCount('scheduled')} Scheduled`}
                                size="small"
                                color="info"
                                variant="outlined"
                            />
                            <Chip
                                label={`${getStatusCount('hired')} Hired`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: 3,
                            }
                        }}
                    >
                        {tabConfig.map((tabItem) => (
                            <StyledTab
                                key={tabItem.value}
                                value={tabItem.value}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {tabItem.label}
                                        <Chip
                                            label={tabItem.count}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                minWidth: 20,
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                backgroundColor: tab === tabItem.value
                                                    ? theme.palette.primary.main
                                                    : alpha(theme.palette.text.secondary, 0.1),
                                                color: tab === tabItem.value ? '1F2937' : theme.palette.text.secondary,
                                            }}
                                        />
                                    </Box>
                                }
                            />
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            {/* Applications Grid */}
            {loading ? (
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress size={60} thickness={4} />
                        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                            Loading applications...
                        </Typography>
                    </Box>
                </Box>
            ) : filteredApps.length === 0 ? (
                <Card sx={{
                    textAlign: 'center',
                    py: 8,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                }}>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No applications found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {tab === 'all'
                                ? "There are no applications for this job yet."
                                : `No applications with status "${tab}".`
                            }
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {filteredApps.map((app) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={app.id}>
                            <ApplicationCard
                                application={app}
                                onStatusChange={handleStatusUpdate}
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)',
                                    }
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

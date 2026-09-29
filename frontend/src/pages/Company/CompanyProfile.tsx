




import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    TextField,
    Grid,
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
    alpha,
    useTheme,
    Chip,
    Divider,
    CircularProgress,
} from "@mui/material";
import {
    Edit,
    Business,
    Language,
    LocationOn,
    Image,
    CorporateFare,
    Public,
    Place,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import GenericModal from "../../components/GenericModal";
import CustomButton from "../../components/CustomButton";
import { createCompanyProfile, getCompanyProfile, updateCompanyProfile } from "../../services/company";

function CompanyProfilePage() {
    const { user } = useAuth();
    const theme = useTheme();

    const [profile, setProfile] = useState<any>(null);
    const [editData, setEditData] = useState<any>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);

    // Fetch profile
    const fetchProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await getCompanyProfile();
            if (res.data.success) {
                setProfile(res.data.company || null);
            }
        } catch (error: any) {
            console.log(error?.data?.message || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData((prev: any) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = (data: any) => {
        let valid = true;
        const newErrors: Record<string, string> = {};

        if (!data.companyName || data.companyName.trim() === "") {
            newErrors.companyName = "Company name is required";
            valid = false;
        }

        if (!data.website || data.website.trim() === "") {
            newErrors.website = "Website is required";
            valid = false;
        }

        if (!data.address || data.address.trim() === "") {
            newErrors.address = "Address is required";
            valid = false;
        }

        if (!data.logourl || data.logourl.trim() === "") {
            newErrors.logourl = "Logo URL is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleOpenModal = () => {
        if (profile) {
            setEditData(profile);
        } else {
            setEditData({
                companyName: "",
                website: "",
                address: "",
                logourl: "",
            });
        }
        setErrors({});
        setOpenModal(true);
    };

    const handleSave = async () => {
        if (!validateForm(editData)) return;

        const allowedFields = ["companyName", "website", "address", "logourl"];
        const payload = Object.fromEntries(
            Object.entries(editData).filter(([key]) => allowedFields.includes(key))
        );

        setSaveLoading(true);
        try {
            if (profile) {
                const res = await updateCompanyProfile(payload);
                if (res.data.success) toast.success("Profile updated successfully!");
            } else {
                const res = await createCompanyProfile(payload);
                if (res.data.success) toast.success("Profile created successfully!");
            }
            await fetchProfile();
            setOpenModal(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Operation failed!");
        } finally {
            setSaveLoading(false);
        }
    };

    const formContent = (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
                <TextField
                    label="Company Name"
                    name="companyName"
                    value={editData.companyName || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                    variant="outlined"
                    InputProps={{
                        startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    label="Website"
                    name="website"
                    value={editData.website || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                    error={!!errors.website}
                    helperText={errors.website}
                    variant="outlined"
                    InputProps={{
                        startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    label="Address"
                    name="address"
                    value={editData.address || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                    error={!!errors.address}
                    helperText={errors.address}
                    variant="outlined"
                    multiline
                    rows={3}
                    InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    label="Logo URL"
                    name="logourl"
                    value={editData.logourl || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                    error={!!errors.logourl}
                    helperText={errors.logourl}
                    variant="outlined"
                    InputProps={{
                        startAdornment: <Image sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                />
            </Grid>
        </Grid>
    );

    const getInitials = (companyName: string) => {
        return companyName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CO';
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{
            padding: 3,
            maxWidth: 1200,
            margin: "0 auto",
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`
        }}>
            {/* Header Card */}
            <Card sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: '1F2937',
                mb: 4
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
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
                                Company Profile
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Manage your company information
                            </Typography>
                        </Box>
                        <CustomButton
                            label={profile ? "Edit Profile" : "Create Profile"}
                            color="primary"
                            startIcon={<Edit />}
                            onClick={handleOpenModal}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                boxShadow: '0 4px 15px 0 rgba(0,0,0,0.2)',
                                '&:hover': {
                                    boxShadow: '0 6px 20px 0 rgba(0,0,0,0.3)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </Box>

                    {profile ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    fontWeight: 'bold',
                                    fontSize: '2.5rem',
                                    border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`
                                }}
                                src={profile.logourl}
                            >
                                {getInitials(profile.companyName)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {profile.companyName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Language fontSize="small" color="action" />
                                    <Typography variant="body1" color="text.secondary">
                                        {profile.website}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <LocationOn fontSize="small" color="action" />
                                    <Typography variant="body1" color="text.secondary">
                                        {profile.address}
                                    </Typography>
                                </Box>
                                <Chip
                                    icon={<Business />}
                                    label="Active Company"
                                    color="success"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{
                            textAlign: 'center',
                            py: 6,
                            background: alpha(theme.palette.primary.light, 0.05),
                            borderRadius: 3,
                            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`
                        }}>
                            <CorporateFare sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h5" color="text.secondary" gutterBottom>
                                No Company Profile Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Create your company profile to start posting jobs and managing applications
                            </Typography>
                            <CustomButton
                                label="Create Company Profile"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={handleOpenModal}
                                sx={{
                                    borderRadius: 3,
                                    px: 4,
                                    py: 1.5,
                                }}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Company Details Card */}
            {profile && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{
                            borderRadius: 3,
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            background: '1F2937',
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: theme.palette.primary.main
                                }}>
                                    <Business />
                                    Company Details
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <Business color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Company Name
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {profile.companyName}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <Public color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Website
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                <a
                                                    href={profile.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: theme.palette.primary.main,
                                                        textDecoration: 'none',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {profile.website}
                                                </a>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{
                            borderRadius: 3,
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            background: '1F2937',
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: theme.palette.primary.main
                                }}>
                                    <Place />
                                    Location Information
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <LocationOn color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Company Address
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {profile.address}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <Image color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Logo
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {profile.logourl ? (
                                                    <a
                                                        href={profile.logourl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: theme.palette.primary.main,
                                                            textDecoration: 'none',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        View Logo
                                                    </a>
                                                ) : 'No logo uploaded'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Profile Modal */}
            <GenericModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={profile ? "Edit Company Profile" : "Create Company Profile"}
                actions={
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <CustomButton
                            label="Cancel"
                            color="secondary"
                            variant="outlined"
                            onClick={() => setOpenModal(false)}
                        />
                        <CustomButton
                            label={saveLoading ? <CircularProgress size={24} color="inherit" /> : (profile ? "Update Profile" : "Create Profile")}
                            color="primary"
                            onClick={handleSave}
                            disabled={saveLoading}
                            sx={{
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            }}
                        />
                    </Box>
                }
            >
                {formContent}
            </GenericModal>
        </Box>
    );
}

export default CompanyProfilePage;
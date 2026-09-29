
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    TextField,
    Grid,
    Box,
    Typography,
    Avatar,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    alpha,
    useTheme,
    Divider,
    CircularProgress,
} from "@mui/material";
import {
    Edit,
    Person,
    Email,
    Phone,
    LocationOn,
    Cake,
    WorkHistory,
    Code,
    Description,
    Female,
    Male,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import GenericModal from "../../components/GenericModal";
import CustomButton from "../../components/CustomButton";
import {
    createCandidateProfile,
    getCandidateProfile,
    updateCandidateProfile,
} from "../../services/candidate";

function CandidateProfilePage() {
    const { user } = useAuth();
    const theme = useTheme();
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
            setEditData((prev: any) => ({ ...prev, resume: e.target.files![0].name }));
            if (errors["resume"]) setErrors((prev) => ({ ...prev, resume: "" }));
        }
    };

    const [profile, setProfile] = useState<any>(null);
    const [editData, setEditData] = useState<any>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openModal, setOpenModal] = useState(false);

    // Fetch profile
    const fetchProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await getCandidateProfile();
            if (res.data.success) {
                setProfile(res.data.result || null);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data?.message || "Failed to fetch profile");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);


    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData((prev: any) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (e: any) => {
        setEditData((prev: any) => ({ ...prev, gender: e.target.value }));
        if (errors["gender"]) setErrors((prev) => ({ ...prev, gender: "" }));
    };

    const validateForm = (data: any) => {
        let valid = true;
        const newErrors: Record<string, string> = {};

        Object.entries(data).forEach(([key, value]) => {
            if (!value || String(value).trim() === "") {
                newErrors[key] = `${key.replace(/_/g, " ")} is required`;
                valid = false;
            }
        });

        setErrors(newErrors);
        return valid;
    };

    const handleOpenModal = () => {
        if (profile) {
            setEditData({
                ...profile,
                date_of_birth: profile.date_of_birth?.split("T")[0],
                skills: profile.skills || [],
            });
        } else {
            setEditData({
                age: "",
                address: "",
                skills: [],
                experienceYears: "",
                resume: "",
                gender: "",
                date_of_birth: "",
                phone_number: "",
            });
        }
        setErrors({});
        setOpenModal(true);
    };

    const handleSave = async () => {
        if (!validateForm(editData)) return;

        setSaveLoading(true);
        try {
            const formData = new FormData();

            Object.entries(editData).forEach(([key, value]) => {
                if (key === "resume") return;

                if (key === "skills" && Array.isArray(value)) {
                    value.forEach(skill => formData.append("skills[]", skill));
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            if (resumeFile) {
                formData.append("resume", resumeFile);
            }

            let res;
            if (profile) {
                res = await updateCandidateProfile(formData);
            } else {
                res = await createCandidateProfile(formData);
            }

            if (res.data.success) {
                toast.success(profile ? "Profile updated successfully!" : "Profile created successfully!");
                await fetchProfile();
                setOpenModal(false);
                setResumeFile(null);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Operation failed!");
        } finally {
            setSaveLoading(false);
        }
    };


    const formContent = (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Age"
                    name="age"
                    value={editData.age || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                    error={!!errors.age}
                    helperText={errors.age}
                    variant="outlined"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Phone Number"
                    name="phone_number"
                    value={editData.phone_number || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                    variant="outlined"
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
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={!!errors.gender} variant="outlined">
                    <InputLabel>Gender</InputLabel>
                    <Select
                        name="gender"
                        value={editData.gender || ""}
                        onChange={handleSelectChange}
                        label="Gender"
                    >
                        <MenuItem value="male">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Male fontSize="small" />
                                Male
                            </Box>
                        </MenuItem>
                        <MenuItem value="female">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Female fontSize="small" />
                                Female
                            </Box>
                        </MenuItem>
                    </Select>
                    {errors.gender && <Typography variant="caption" color="error">{errors.gender}</Typography>}
                </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Experience Years"
                    name="experienceYears"
                    value={editData.experienceYears || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                    error={!!errors.experienceYears}
                    helperText={errors.experienceYears}
                    variant="outlined"
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    label="Skills (comma separated)"
                    name="skills"
                    value={editData.skills?.join(", ") || ""}
                    onChange={(e) =>
                        setEditData({ ...editData, skills: e.target.value.split(",").map((s) => s.trim()) })
                    }
                    fullWidth
                    required
                    error={!!errors.skills}
                    helperText={errors.skills}
                    variant="outlined"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    label="Date of Birth"
                    name="date_of_birth"
                    type="date"
                    value={editData.date_of_birth || ""}
                    onChange={handleEditChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.date_of_birth}
                    helperText={errors.date_of_birth}
                    variant="outlined"
                />
            </Grid>



            <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Upload Resume (PDF)
                </Typography>

                <label
                    htmlFor="resume-upload"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '8px',
                        fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1565c0';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1976d2';
                    }}
                >
                    <span>📤</span>
                    Choose File
                    <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </label>

                {editData.resume && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, fontStyle: 'italic' }}
                    >
                        Selected: {editData.resume}
                    </Typography>
                )}
                {errors.resume && (
                    <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: 'block', mt: 1 }}
                    >
                        {errors.resume}
                    </Typography>
                )}
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    label="Email"
                    name="email"
                    value={profile?.email || user?.email || ""}
                    fullWidth
                    disabled
                    variant="outlined"
                />
            </Grid>
        </Grid>
    );

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
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
                                Candidate Profile
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Manage your professional information
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
                                    width: 100,
                                    height: 100,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    fontWeight: 'bold',
                                    fontSize: '2rem',
                                    border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`
                                }}
                            >
                                {getInitials(profile?.firstName, profile?.lastName)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {profile?.firstName} {profile?.lastName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Email fontSize="small" color="action" />
                                    <Typography variant="body1" color="text.secondary">
                                        {profile?.email}
                                    </Typography>
                                </Box>
                                <Chip
                                    icon={profile.gender === 'female' ? <Female /> : <Male />}
                                    label={profile.gender ? `${profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}` : "Not specified"}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{
                            textAlign: 'center',
                            py: 4,
                            background: alpha(theme.palette.primary.light, 0.05),
                            borderRadius: 3,
                            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`
                        }}>
                            <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No Profile Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create your profile to start applying for jobs
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Profile Details Card */}
            {profile && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }} >
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
                                    <Person />
                                    Personal Information
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Cake color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Age
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {profile.age || 'Not specified'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Phone color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Phone
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {profile.phone_number || 'Not specified'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <LocationOn color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Address
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {profile.address || 'Not specified'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {profile.date_of_birth && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Cake color="action" />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Date of Birth
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {new Date(profile.date_of_birth).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }} >
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
                                    <WorkHistory />
                                    Professional Information
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <WorkHistory color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Experience
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {profile.experienceYears ? `${profile.experienceYears} years` : 'Not specified'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Code color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Skills
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                {profile.skills?.map((skill: string, index: number) => (
                                                    <Chip
                                                        key={index}
                                                        label={skill}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                    />
                                                )) || <Typography variant="body2">No skills added</Typography>}
                                            </Box>
                                        </Box>
                                    </Box>

                                    {profile.resume && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Description color="action" />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Resume
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    <a
                                                        href={profile.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                                                    >
                                                        View Resume
                                                    </a>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )
            }

            {/* Profile Modal */}
            <GenericModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={profile ? "Edit Profile" : "Create Profile"}
                actions={
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <CustomButton
                            label="Cancel"
                            color="secondary"
                            variant="outlined"
                            onClick={() => setOpenModal(false)}
                        />
                        <CustomButton
                            label={saveLoading ? <CircularProgress size={24} color="inherit" /> : "SAVE PROFILE"}
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
        </Box >
    );
}

export default CandidateProfilePage;



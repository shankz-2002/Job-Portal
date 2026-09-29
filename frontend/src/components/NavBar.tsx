
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Badge,
    Chip,
    useTheme,
    alpha,
    Fade,
    Button,
    Box,
    Container,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    useMediaQuery,
} from '@mui/material';
import {
    Logout,
    Notifications as Bell,
    AccountCircle,
    Settings,
    Menu as MenuIcon,
    Work,
    Dashboard,
    Article,
    People,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/zenploy-high-resolution-logo.png"

function Navbar() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileDrawer, setMobileDrawer] = useState(false);
    const open = Boolean(anchorEl);

    // Media queries for responsive design
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    if (!user) return null;

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const toggleDrawer = () => setMobileDrawer(!mobileDrawer);

    const handleLogout = () => {
        handleClose();
        logout();
        navigate("/login");
    };

    const handleProfile = () => {
        handleClose();
        if (user.role === 'candidate') navigate("/candidate-profile");
        else navigate("/company-profile")
    };

    const handleDashboard = () => {
        if (user.role === "company") navigate("/company-dashboard");
        else if (user.role === "candidate") navigate("/candidate-dashboard");
        else navigate("/dashboard");
    };

    const isActiveRoute = (path: string) => location.pathname === path;

    const navigationItems = {
        candidate: [
            { label: 'Find Jobs', path: '/candidate/jobs', icon: <Work /> },
            { label: 'Applications', path: '/candidate/applications', icon: <Article /> },
        ],
        company: [
            { label: 'Post Job', path: '/company/jobs', icon: <Work /> },
            { label: 'Reschedule Requests', path: '/company/reschedule', icon: <Article /> },
            { label: 'Todays Interview', path: '/company/todayinterview', icon: <People /> },
        ]
    };

    const handleLogo = async () => {
        if (user.role === 'company') navigate('/company-dashboard')
        else navigate('/candidate-dashboard');
    }

    const currentNavItems = navigationItems[user.role as keyof typeof navigationItems] || [];

    const MobileMenu = () => (
        <Drawer
            anchor="right"
            open={mobileDrawer}
            onClose={toggleDrawer}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 280,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                    backdropFilter: 'blur(25px)',
                    borderLeft: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                {/* User Info */}
                <Box display="flex" alignItems="center" gap={2} mb={3} p={2}>
                    <Avatar
                        sx={{
                            bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            width: 48,
                            height: 48,
                            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {user.firstName?.[0]}{user.lastName?.[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Chip
                            label={user.role}
                            size="small"
                            variant="filled"
                            sx={{
                                textTransform: "capitalize",
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 20,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ mb: 2, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

                {/* Navigation Links */}
                <List>
                    <ListItemButton
                        onClick={() => {
                            handleDashboard();
                            toggleDrawer();
                        }}
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                            background: isActiveRoute('/dashboard')
                                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
                                : 'transparent',
                            border: `1px solid ${isActiveRoute('/dashboard') ? alpha(theme.palette.primary.main, 0.2) : 'transparent'}`,
                        }}
                    >
                        <ListItemIcon>
                            <Dashboard sx={{
                                color: isActiveRoute('/dashboard') ? theme.palette.primary.main : theme.palette.text.secondary
                            }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Dashboard"
                            primaryTypographyProps={{
                                color: isActiveRoute('/dashboard') ? theme.palette.primary.main : theme.palette.text.primary,
                                fontWeight: isActiveRoute('/dashboard') ? 600 : 400,
                            }}
                        />
                    </ListItemButton>

                    {currentNavItems.map((item) => (
                        <ListItemButton
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                toggleDrawer();
                            }}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                background: isActiveRoute(item.path)
                                    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
                                    : 'transparent',
                                border: `1px solid ${isActiveRoute(item.path) ? alpha(theme.palette.primary.main, 0.2) : 'transparent'}`,
                            }}
                        >
                            <ListItemIcon>
                                {React.cloneElement(item.icon, {
                                    sx: {
                                        color: isActiveRoute(item.path) ? theme.palette.primary.main : theme.palette.text.secondary
                                    }
                                })}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    color: isActiveRoute(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
                                    fontWeight: isActiveRoute(item.path) ? 600 : 400,
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>

                <Divider sx={{ my: 2, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

                {/* User Menu Items */}
                <List>
                    <ListItemButton
                        onClick={handleProfile}
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                        }}
                    >
                        <ListItemIcon>
                            <AccountCircle sx={{ color: theme.palette.primary.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                    <ListItemButton
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                        }}
                    >
                        <ListItemIcon>
                            <Settings sx={{ color: theme.palette.text.secondary }} />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            color: theme.palette.error.main,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.08),
                            }
                        }}
                    >
                        <ListItemIcon>
                            <Logout sx={{ color: theme.palette.error.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    );

    return (
        <AppBar
            position="sticky"
            sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                backdropFilter: "blur(30px)",
                color: theme.palette.text.primary,
                boxShadow: `0 4px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                backgroundImage: `radial-gradient(circle at 15% 50%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%)`,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: "space-between", py: 1, gap: 2 }}>
                    {/* Logo Section */}
                    <Box display="flex" alignItems="center" gap={3}>
                        <Fade in timeout={500}>
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1.5}
                                sx={{ cursor: "pointer" }}
                                onClick={handleLogo}
                            >
                                <Box
                                    component="img"
                                    src={logo}
                                    alt="Zenploy Logo"
                                    sx={{
                                        height: { xs: 44, md: 60 },
                                        width: "auto",
                                        borderRadius: 2,
                                        objectFit: "contain",
                                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "scale(1.05)",
                                            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
                                        },
                                    }}
                                />

                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    sx={{
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        letterSpacing: "-0.5px",
                                        fontSize: { xs: "1.3rem", md: "1.7rem" },
                                        lineHeight: 1.2,
                                        textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    }}
                                >
                                    Zenploy
                                </Typography>
                            </Box> 
                        </Fade>
                    </Box>

                    {/* Navigation & User Section */}
                    <Box display="flex" alignItems="center" gap={1}>
                        {/* Desktop Navigation */}
                        {isDesktop && (
                            <Box display="flex" gap={1}>
                                {currentNavItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        color="inherit"
                                        onClick={() => navigate(item.path)}
                                        startIcon={item.icon}
                                        sx={{
                                            borderRadius: 3,
                                            px: 2.5,
                                            py: 1,
                                            fontWeight: isActiveRoute(item.path) ? 600 : 500,
                                            background: isActiveRoute(item.path)
                                                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
                                                : 'transparent',
                                            color: isActiveRoute(item.path)
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                            border: `1px solid ${isActiveRoute(item.path) ? alpha(theme.palette.primary.main, 0.3) : 'transparent'}`,
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}

                                {/* Dashboard Button */}
                                <Button
                                    color="inherit"
                                    onClick={handleDashboard}
                                    startIcon={<Dashboard />}
                                    sx={{
                                        borderRadius: 3,
                                        px: 2.5,
                                        py: 1,
                                        fontWeight: isActiveRoute('/dashboard') ? 600 : 500,
                                        background: isActiveRoute('/dashboard')
                                            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
                                            : 'transparent',
                                        color: isActiveRoute('/dashboard')
                                            ? theme.palette.primary.main
                                            : theme.palette.text.primary,
                                        border: `1px solid ${isActiveRoute('/dashboard') ? alpha(theme.palette.primary.main, 0.3) : 'transparent'}`,
                                        '&:hover': {
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Dashboard
                                </Button>
                            </Box>
                        )}

                        {/* Notification & User Section */}
                        <Box display="flex" alignItems="center" gap={1.5}>
                            {/* Notification Icon */}
                            <IconButton
                                sx={{
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    width: 44,
                                    height: 44,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                                        transform: 'scale(1.05)',
                                        boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <Badge
                                    badgeContent={3}
                                    color="error"
                                    variant="dot"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                                        }
                                    }}
                                >
                                    <Bell sx={{
                                        color: theme.palette.primary.main,
                                        fontSize: '1.3rem'
                                    }} />
                                </Badge>
                            </IconButton>

                            {/* User Info - Desktop */}
                            {isDesktop && (
                                <Fade in timeout={800}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={2}
                                        sx={{
                                            px: 2.5,
                                            py: 1.2,
                                            borderRadius: 3,
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                                            }
                                        }}
                                        onClick={handleMenu}
                                    >
                                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                sx={{
                                                    textTransform: "capitalize",
                                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                                                    color: theme.palette.primary.main,
                                                    fontWeight: 600,
                                                    fontSize: '0.65rem',
                                                    height: 18,
                                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                                }}
                                            />
                                        </Box>
                                        <Avatar
                                            sx={{
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                                width: 38,
                                                height: 38,
                                                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            }}
                                        >
                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                        </Avatar>
                                    </Box>
                                </Fade>
                            )}

                            {/* Mobile Menu Button */}
                            {isMobile && (
                                <IconButton
                                    onClick={toggleDrawer}
                                    sx={{
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                                            transform: 'scale(1.05)',
                                        }
                                    }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    {/* User Menu */}
                    <Menu
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: 3,
                                marginTop: 1,
                                minWidth: 200,
                                boxShadow: `0 15px 40px ${alpha(theme.palette.primary.main, 0.25)}`,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                                backdropFilter: 'blur(25px)',
                                '& .MuiMenuItem-root': {
                                    borderRadius: 2,
                                    margin: '2px 8px',
                                    padding: '10px 16px',
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem onClick={handleProfile}>
                            <AccountCircle fontSize="small" sx={{ mr: 2, color: theme.palette.primary.main }} />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Settings fontSize="small" sx={{ mr: 2, color: theme.palette.text.secondary }} />
                            Settings
                        </MenuItem>
                        <Divider sx={{ borderColor: alpha(theme.palette.primary.main, 0.1) }} />
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                                }
                            }}
                        >
                            <Logout fontSize="small" sx={{ mr: 2 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </Container>

            {/* Mobile Drawer */}
            <MobileMenu />
        </AppBar>
    );
}

export default Navbar;
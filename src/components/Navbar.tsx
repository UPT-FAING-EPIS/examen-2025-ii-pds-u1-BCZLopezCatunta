import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Sistema de Exámenes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            variant={isActive('/') ? 'outlined' : 'text'}
          >
            Inicio
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/student')}
            variant={isActive('/student') ? 'outlined' : 'text'}
          >
            Estudiante
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/teacher')}
            variant={isActive('/teacher') ? 'outlined' : 'text'}
          >
            Docente
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

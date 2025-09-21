import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Sistema de Exámenes en Línea
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Plataforma moderna para la gestión y realización de exámenes académicos
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <PersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography variant="h4" component="h2" gutterBottom align="center">
                Panel de Estudiante
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Accede a tus exámenes asignados, realiza evaluaciones con temporizador
                y consulta tus resultados de manera instantánea.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', p: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/student')}
              >
                Ir al Panel de Estudiante
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
              </Box>
              <Typography variant="h4" component="h2" gutterBottom align="center">
                Panel de Docente
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Crea y gestiona exámenes, asigna evaluaciones a estudiantes,
                y analiza resultados con reportes detallados.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', p: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/teacher')}
              >
                Ir al Panel de Docente
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Características Principales
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Temporizador
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Control de tiempo automático para cada examen
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Múltiples Tipos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preguntas de opción múltiple, verdadero/falso y texto libre
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Resultados Instantáneos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calificación automática y reportes detallados
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Seguridad
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Protección contra copia y navegación segura
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;

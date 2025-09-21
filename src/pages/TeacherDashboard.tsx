import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  Assignment,
  People,
  TrendingUp,
  Edit,
  Visibility,
} from '@mui/icons-material';
import { examService } from '../services/api';
import { Exam } from '../types';

const TeacherDashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      // TODO: Get actual user ID from authentication
      const userExams = await examService.getExamsByUser(1);
      setExams(userExams);
    } catch (err) {
      setError('Error al cargar los exámenes');
      console.error('Error loading exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);

    if (!exam.isActive) {
      return { status: 'inactive', color: 'default', text: 'Inactivo' };
    } else if (now < startTime) {
      return { status: 'upcoming', color: 'info', text: 'Programado' };
    } else if (now >= startTime && now <= endTime) {
      return { status: 'active', color: 'success', text: 'Activo' };
    } else {
      return { status: 'completed', color: 'secondary', text: 'Completado' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const handleCreateExam = () => {
    navigate('/create-exam');
  };

  const handleViewResults = (examId: number) => {
    navigate(`/exam-results/${examId}`);
  };

  const handleEditExam = (examId: number) => {
    // TODO: Implement edit exam functionality
    console.log('Edit exam:', examId);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Panel de Docente
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gestiona tus exámenes y revisa resultados
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateExam}
          size="large"
        >
          Crear Examen
        </Button>
      </Box>

      {exams.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes exámenes creados
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Comienza creando tu primer examen
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateExam}
            >
              Crear Primer Examen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {exams.map((exam) => {
            const examStatus = getExamStatus(exam);

            return (
              <Grid item xs={12} md={6} lg={4} key={exam.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                        {exam.title}
                      </Typography>
                      <Chip
                        label={examStatus.text}
                        color={examStatus.color as any}
                        size="small"
                      />
                    </Box>

                    {exam.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {exam.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Assignment sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Preguntas: {exam.questions.length}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Duración: {exam.durationMinutes} min
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Inicio:</strong> {formatDate(exam.startTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fin:</strong> {formatDate(exam.endTime)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditExam(exam.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<TrendingUp />}
                      onClick={() => handleViewResults(exam.id)}
                    >
                      Resultados
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateExam}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default TeacherDashboard;

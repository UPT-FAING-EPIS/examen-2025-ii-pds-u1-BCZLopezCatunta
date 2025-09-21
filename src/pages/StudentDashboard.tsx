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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccessTime, Assignment, CheckCircle } from '@mui/icons-material';
import { examService } from '../services/api';
import { Exam } from '../types';

const StudentDashboard: React.FC = () => {
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
      const availableExams = await examService.getAllExams();
      setExams(availableExams);
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

    if (now < startTime) {
      return { status: 'upcoming', color: 'info', text: 'Próximamente' };
    } else if (now >= startTime && now <= endTime) {
      return { status: 'available', color: 'success', text: 'Disponible' };
    } else {
      return { status: 'expired', color: 'error', text: 'Expirado' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const handleStartExam = async (examId: number) => {
    try {
      navigate(`/exam/${examId}`);
    } catch (err) {
      console.error('Error starting exam:', err);
    }
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Panel de Estudiante
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Exámenes disponibles y en progreso
        </Typography>
      </Box>

      {exams.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No hay exámenes disponibles en este momento
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {exams.map((exam) => {
            const examStatus = getExamStatus(exam);
            const isAvailable = examStatus.status === 'available';

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
                      <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Duración: {exam.durationMinutes} minutos
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Assignment sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Preguntas: {exam.questions.length}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Inicio:</strong> {formatDate(exam.startTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fin:</strong> {formatDate(exam.endTime)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={!isAvailable}
                      onClick={() => handleStartExam(exam.id)}
                      startIcon={isAvailable ? <CheckCircle /> : <AccessTime />}
                    >
                      {isAvailable ? 'Comenzar Examen' : 'No Disponible'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default StudentDashboard;

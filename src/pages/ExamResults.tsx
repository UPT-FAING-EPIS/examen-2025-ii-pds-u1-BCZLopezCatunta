import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  LinearProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { examAttemptService } from '../services/api';
import { ExamAttempt } from '../types';

const ExamResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadResults();
    }
  }, [id]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const results = await examAttemptService.getExamResults(parseInt(id!));
      setAttempts(results);
    } catch (err) {
      setError('Error al cargar los resultados');
      console.error('Error loading results:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'InProgress':
        return 'warning';
      case 'Abandoned':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'Completado';
      case 'InProgress':
        return 'En Progreso';
      case 'Abandoned':
        return 'Abandonado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const calculateAverageScore = () => {
    const completedAttempts = attempts.filter(a => a.status === 'Completed' && a.score !== null);
    if (completedAttempts.length === 0) return 0;
    
    const totalScore = completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    return totalScore / completedAttempts.length;
  };

  const getCompletionRate = () => {
    const totalAttempts = attempts.length;
    const completedAttempts = attempts.filter(a => a.status === 'Completed').length;
    return totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;
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
          Resultados del Examen
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Análisis de rendimiento y estadísticas
        </Typography>
      </Box>

      {attempts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No hay intentos de examen registrados
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {attempts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Intentos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success.main">
                    {attempts.filter(a => a.status === 'Completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completados
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="info.main">
                    {getCompletionRate().toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tasa de Finalización
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="warning.main">
                    {calculateAverageScore().toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Puntuación Promedio
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Results Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalles de Intentos
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Estudiante</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Puntuación</TableCell>
                      <TableCell>Iniciado</TableCell>
                      <TableCell>Completado</TableCell>
                      <TableCell>Duración</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attempts.map((attempt) => {
                      const startTime = new Date(attempt.startedAt);
                      const endTime = attempt.completedAt ? new Date(attempt.completedAt) : new Date();
                      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000); // minutes

                      return (
                        <TableRow key={attempt.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {attempt.userName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusText(attempt.status)}
                              color={getStatusColor(attempt.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {attempt.score !== null ? (
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {attempt.score} / {attempt.totalPoints}
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={attempt.totalPoints ? (attempt.score / attempt.totalPoints) * 100 : 0}
                                  sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                                />
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(attempt.startedAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {attempt.completedAt ? (
                              <Typography variant="body2">
                                {formatDate(attempt.completedAt)}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {duration} min
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default ExamResults;

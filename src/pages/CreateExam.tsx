import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { examService } from '../services/api';
import { CreateExamRequest, CreateQuestionRequest, CreateQuestionOptionRequest } from '../types';

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const [exam, setExam] = useState<CreateExamRequest>({
    title: '',
    description: '',
    durationMinutes: 60,
    startTime: '',
    endTime: '',
    questions: [],
  });

  const [loading, setLoading] = useState(false);

  const handleExamChange = (field: keyof CreateExamRequest, value: any) => {
    setExam(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addQuestion = () => {
    const newQuestion: CreateQuestionRequest = {
      text: '',
      type: 'MultipleChoice',
      points: 1,
      order: exam.questions.length + 1,
      options: [],
    };
    setExam(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, field: keyof CreateQuestionRequest, value: any) => {
    setExam(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const deleteQuestion = (index: number) => {
    setExam(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const addOption = (questionIndex: number) => {
    const newOption: CreateQuestionOptionRequest = {
      text: '',
      isCorrect: false,
      order: exam.questions[questionIndex].options.length + 1,
    };
    updateQuestion(questionIndex, 'options', [...exam.questions[questionIndex].options, newOption]);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof CreateQuestionOptionRequest, value: any) => {
    const updatedOptions = exam.questions[questionIndex].options.map((opt, i) =>
      i === optionIndex ? { ...opt, [field]: value } : opt
    );
    updateQuestion(questionIndex, 'options', updatedOptions);
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const updatedOptions = exam.questions[questionIndex].options.filter((_, i) => i !== optionIndex);
    updateQuestion(questionIndex, 'options', updatedOptions);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await examService.createExam(exam);
      navigate('/teacher');
    } catch (error) {
      console.error('Error creating exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return exam.title && 
           exam.durationMinutes > 0 && 
           exam.startTime && 
           exam.endTime &&
           exam.questions.length > 0 &&
           exam.questions.every(q => 
             q.text && 
             q.points > 0 &&
             (q.type === 'Text' || q.options.length > 0)
           );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Crear Nuevo Examen
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Configura los detalles del examen y agrega las preguntas
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Examen
              </Typography>
              
              <TextField
                fullWidth
                label="Título del Examen"
                value={exam.title}
                onChange={(e) => handleExamChange('title', e.target.value)}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Descripción"
                value={exam.description}
                onChange={(e) => handleExamChange('description', e.target.value)}
                margin="normal"
                multiline
                rows={3}
              />
              
              <TextField
                fullWidth
                label="Duración (minutos)"
                type="number"
                value={exam.durationMinutes}
                onChange={(e) => handleExamChange('durationMinutes', parseInt(e.target.value))}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Fecha y Hora de Inicio"
                type="datetime-local"
                value={exam.startTime}
                onChange={(e) => handleExamChange('startTime', e.target.value)}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                fullWidth
                label="Fecha y Hora de Fin"
                type="datetime-local"
                value={exam.endTime}
                onChange={(e) => handleExamChange('endTime', e.target.value)}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Preguntas ({exam.questions.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addQuestion}
                >
                  Agregar Pregunta
                </Button>
              </Box>

              {exam.questions.map((question, questionIndex) => (
                <Card key={questionIndex} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">
                        Pregunta {questionIndex + 1}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => deleteQuestion(questionIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <TextField
                          fullWidth
                          label="Texto de la Pregunta"
                          value={question.text}
                          onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                          margin="normal"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="Puntos"
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value))}
                          margin="normal"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Tipo</InputLabel>
                          <Select
                            value={question.type}
                            onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                          >
                            <MenuItem value="MultipleChoice">Opción Múltiple</MenuItem>
                            <MenuItem value="TrueFalse">Verdadero/Falso</MenuItem>
                            <MenuItem value="Text">Texto Libre</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {question.type !== 'Text' && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">Opciones</Typography>
                          <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => addOption(questionIndex)}
                          >
                            Agregar Opción
                          </Button>
                        </Box>

                        {question.options.map((option, optionIndex) => (
                          <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                              fullWidth
                              size="small"
                              value={option.text}
                              onChange={(e) => updateOption(questionIndex, optionIndex, 'text', e.target.value)}
                              placeholder="Texto de la opción"
                            />
                            <Chip
                              label={option.isCorrect ? 'Correcta' : 'Incorrecta'}
                              color={option.isCorrect ? 'success' : 'default'}
                              onClick={() => updateOption(questionIndex, optionIndex, 'isCorrect', !option.isCorrect)}
                              sx={{ ml: 1, cursor: 'pointer' }}
                            />
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteOption(questionIndex, optionIndex)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}

              {exam.questions.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay preguntas agregadas
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addQuestion}
                    sx={{ mt: 2 }}
                  >
                    Agregar Primera Pregunta
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/teacher')}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={!isFormValid() || loading}
        >
          {loading ? 'Guardando...' : 'Crear Examen'}
        </Button>
      </Box>
    </Container>
  );
};

export default CreateExam;

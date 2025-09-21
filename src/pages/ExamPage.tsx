import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  LinearProgress,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormGroup,
  Checkbox,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { examService, examAttemptService } from '../services/api';
import { Exam, Question, ExamAttempt, SubmitAnswerRequest } from '../types';

const ExamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: number]: any }>({});

  useEffect(() => {
    if (id) {
      loadExam();
    }
  }, [id]);

  useEffect(() => {
    if (attempt && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [attempt]);

  const loadExam = async () => {
    try {
      setLoading(true);
      const examData = await examService.getExamForStudent(parseInt(id!));
      setExam(examData);
      
      // Start exam attempt
      const attemptData = await examService.startExamAttempt({ examId: parseInt(id!) });
      setAttempt(attemptData);
      setTimeLeft(examData.durationMinutes * 60);
    } catch (err) {
      setError('Error al cargar el examen');
      console.error('Error loading exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitAnswer = async (questionId: number) => {
    if (!attempt) return;

    const answer = answers[questionId];
    if (!answer) return;

    try {
      const submitRequest: SubmitAnswerRequest = {
        questionId,
        ...answer
      };

      const updatedAttempt = await examService.submitAnswer(attempt.id, submitRequest);
      setAttempt(updatedAttempt);
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const handleSubmitExam = async () => {
    if (!attempt) return;

    try {
      // Submit all remaining answers
      for (const [questionId, answer] of Object.entries(answers)) {
        if (answer && !attempt.answers.find(a => a.questionId === parseInt(questionId))) {
          const submitRequest: SubmitAnswerRequest = {
            questionId: parseInt(questionId),
            ...answer
          };
          await examService.submitAnswer(attempt.id, submitRequest);
        }
      }

      // Complete the exam
      const completedAttempt = await examService.completeExamAttempt(attempt.id);
      setAttempt(completedAttempt);
      
      // Navigate to results
      navigate(`/exam-results/${attempt.examId}`);
    } catch (err) {
      console.error('Error submitting exam:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!exam) return 0;
    return ((currentQuestionIndex + 1) / exam.questions.length) * 100;
  };

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id];
    const submittedAnswer = attempt?.answers.find(a => a.questionId === question.id);

    switch (question.type) {
      case 'MultipleChoice':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.text}</FormLabel>
            <RadioGroup
              value={submittedAnswer?.selectedOptionId || currentAnswer?.selectedOptionId || ''}
              onChange={(e) => handleAnswerChange(question.id, { selectedOptionId: parseInt(e.target.value) })}
            >
              {question.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                  disabled={!!submittedAnswer}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'TrueFalse':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.text}</FormLabel>
            <RadioGroup
              value={submittedAnswer?.booleanAnswer !== undefined ? submittedAnswer.booleanAnswer.toString() : currentAnswer?.booleanAnswer?.toString() || ''}
              onChange={(e) => handleAnswerChange(question.id, { booleanAnswer: e.target.value === 'true' })}
            >
              <FormControlLabel value="true" control={<Radio />} label="Verdadero" disabled={!!submittedAnswer} />
              <FormControlLabel value="false" control={<Radio />} label="Falso" disabled={!!submittedAnswer} />
            </RadioGroup>
          </FormControl>
        );

      case 'Text':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>{question.text}</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={submittedAnswer?.textAnswer || currentAnswer?.textAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, { textAnswer: e.target.value })}
              disabled={!!submittedAnswer}
              placeholder="Escribe tu respuesta aquí..."
            />
          </Box>
        );

      default:
        return <Typography>Tipo de pregunta no soportado</Typography>;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !exam || !attempt) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'No se pudo cargar el examen'}
        </Alert>
      </Container>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {exam.title}
          </Typography>
          <Typography
            variant="h5"
            color={timeLeft < 300 ? 'error' : 'primary'}
            sx={{ fontWeight: 'bold' }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </Box>
        
        <LinearProgress variant="determinate" value={getProgress()} sx={{ mb: 2 }} />
        
        <Typography variant="body2" color="text.secondary">
          Pregunta {currentQuestionIndex + 1} de {exam.questions.length}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            {renderQuestion(currentQuestion)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="outlined"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            >
              Anterior
            </Button>
            
            <Button
              variant="contained"
              onClick={() => handleSubmitAnswer(currentQuestion.id)}
            >
              Guardar Respuesta
            </Button>
            
            <Button
              variant="outlined"
              disabled={currentQuestionIndex === exam.questions.length - 1}
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            >
              Siguiente
            </Button>
          </Box>

          {currentQuestionIndex === exam.questions.length - 1 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleSubmitExam}
              >
                Finalizar Examen
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ExamPage;

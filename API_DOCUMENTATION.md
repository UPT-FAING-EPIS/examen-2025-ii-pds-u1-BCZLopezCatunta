# Documentación de API - Sistema de Exámenes en Línea

## 📋 Resumen

Esta documentación describe la API REST del Sistema de Exámenes en Línea, desarrollada con ASP.NET Core 9.0. La API proporciona endpoints para la gestión de exámenes, intentos de examen y análisis de resultados.

## 🔗 Información Base

- **URL Base**: `https://tu-app.azurewebsites.net/api`
- **Versión**: 1.0
- **Formato**: JSON
- **Autenticación**: JWT (pendiente de implementar)
- **Documentación Interactiva**: Swagger UI disponible en `/swagger`

## 📚 Endpoints Principales

### Exámenes (Exams)

#### Obtener Todos los Exámenes
```http
GET /api/exams
```

**Descripción**: Obtiene la lista de todos los exámenes disponibles.

**Respuesta**:
```json
[
  {
    "id": 1,
    "title": "Examen de Matemáticas",
    "description": "Examen básico de matemáticas",
    "durationMinutes": 60,
    "startTime": "2024-01-01T10:00:00Z",
    "endTime": "2024-01-01T12:00:00Z",
    "isActive": true,
    "createdAt": "2024-01-01T09:00:00Z",
    "createdByUserId": 1,
    "createdByUserName": "Profesor Juan",
    "questions": [
      {
        "id": 1,
        "text": "¿Cuánto es 2 + 2?",
        "type": "MultipleChoice",
        "points": 5,
        "order": 1,
        "options": [
          {
            "id": 1,
            "text": "3",
            "isCorrect": false,
            "order": 1
          },
          {
            "id": 2,
            "text": "4",
            "isCorrect": true,
            "order": 2
          }
        ]
      }
    ]
  }
]
```

#### Obtener Examen por ID
```http
GET /api/exams/{id}
```

**Parámetros**:
- `id` (int): ID del examen

**Respuesta**:
```json
{
  "id": 1,
  "title": "Examen de Matemáticas",
  "description": "Examen básico de matemáticas",
  "durationMinutes": 60,
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T12:00:00Z",
  "isActive": true,
  "createdAt": "2024-01-01T09:00:00Z",
  "createdByUserId": 1,
  "createdByUserName": "Profesor Juan",
  "questions": [...]
}
```

#### Crear Nuevo Examen
```http
POST /api/exams
Content-Type: application/json
```

**Cuerpo de la Solicitud**:
```json
{
  "title": "Nuevo Examen",
  "description": "Descripción del examen",
  "durationMinutes": 90,
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T12:00:00Z",
  "questions": [
    {
      "text": "¿Cuál es la capital de Francia?",
      "type": "MultipleChoice",
      "points": 10,
      "order": 1,
      "options": [
        {
          "text": "Madrid",
          "isCorrect": false,
          "order": 1
        },
        {
          "text": "París",
          "isCorrect": true,
          "order": 2
        },
        {
          "text": "Londres",
          "isCorrect": false,
          "order": 3
        }
      ]
    },
    {
      "text": "El agua hierve a 100°C",
      "type": "TrueFalse",
      "points": 5,
      "order": 2,
      "options": []
    }
  ]
}
```

**Respuesta**:
```json
{
  "id": 2,
  "title": "Nuevo Examen",
  "description": "Descripción del examen",
  "durationMinutes": 90,
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T12:00:00Z",
  "isActive": true,
  "createdAt": "2024-01-01T09:30:00Z",
  "createdByUserId": 1,
  "createdByUserName": "Profesor Juan",
  "questions": [...]
}
```

#### Actualizar Examen
```http
PUT /api/exams/{id}
Content-Type: application/json
```

**Parámetros**:
- `id` (int): ID del examen a actualizar

**Cuerpo de la Solicitud**:
```json
{
  "title": "Examen Actualizado",
  "description": "Nueva descripción",
  "durationMinutes": 120,
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T14:00:00Z",
  "isActive": true
}
```

#### Eliminar Examen
```http
DELETE /api/exams/{id}
```

**Parámetros**:
- `id` (int): ID del examen a eliminar

**Respuesta**: 204 No Content

### Intentos de Examen (Exam Attempts)

#### Iniciar Intento de Examen
```http
POST /api/examattempts/start
Content-Type: application/json
```

**Cuerpo de la Solicitud**:
```json
{
  "examId": 1
}
```

**Respuesta**:
```json
{
  "id": 1,
  "startedAt": "2024-01-01T10:30:00Z",
  "completedAt": null,
  "score": null,
  "totalPoints": 50,
  "status": "InProgress",
  "userId": 2,
  "userName": "Estudiante María",
  "examId": 1,
  "examTitle": "Examen de Matemáticas",
  "answers": []
}
```

#### Obtener Intento de Examen
```http
GET /api/examattempts/{id}
```

**Parámetros**:
- `id` (int): ID del intento de examen

**Respuesta**:
```json
{
  "id": 1,
  "startedAt": "2024-01-01T10:30:00Z",
  "completedAt": null,
  "score": null,
  "totalPoints": 50,
  "status": "InProgress",
  "userId": 2,
  "userName": "Estudiante María",
  "examId": 1,
  "examTitle": "Examen de Matemáticas",
  "answers": [
    {
      "id": 1,
      "textAnswer": null,
      "selectedOptionId": 2,
      "booleanAnswer": null,
      "pointsEarned": 5,
      "answeredAt": "2024-01-01T10:35:00Z",
      "questionId": 1,
      "questionText": "¿Cuánto es 2 + 2?",
      "selectedOptionText": "4"
    }
  ]
}
```

#### Enviar Respuesta
```http
POST /api/examattempts/{id}/answer
Content-Type: application/json
```

**Parámetros**:
- `id` (int): ID del intento de examen

**Cuerpo de la Solicitud**:
```json
{
  "questionId": 1,
  "selectedOptionId": 2
}
```

**Para preguntas de texto libre**:
```json
{
  "questionId": 2,
  "textAnswer": "La capital de Francia es París"
}
```

**Para preguntas verdadero/falso**:
```json
{
  "questionId": 3,
  "booleanAnswer": true
}
```

**Respuesta**:
```json
{
  "id": 1,
  "startedAt": "2024-01-01T10:30:00Z",
  "completedAt": null,
  "score": 5,
  "totalPoints": 50,
  "status": "InProgress",
  "userId": 2,
  "userName": "Estudiante María",
  "examId": 1,
  "examTitle": "Examen de Matemáticas",
  "answers": [
    {
      "id": 1,
      "textAnswer": null,
      "selectedOptionId": 2,
      "booleanAnswer": null,
      "pointsEarned": 5,
      "answeredAt": "2024-01-01T10:35:00Z",
      "questionId": 1,
      "questionText": "¿Cuánto es 2 + 2?",
      "selectedOptionText": "4"
    }
  ]
}
```

#### Finalizar Examen
```http
POST /api/examattempts/{id}/complete
```

**Parámetros**:
- `id` (int): ID del intento de examen

**Respuesta**:
```json
{
  "id": 1,
  "startedAt": "2024-01-01T10:30:00Z",
  "completedAt": "2024-01-01T11:30:00Z",
  "score": 45,
  "totalPoints": 50,
  "status": "Completed",
  "userId": 2,
  "userName": "Estudiante María",
  "examId": 1,
  "examTitle": "Examen de Matemáticas",
  "answers": [...]
}
```

## 🔍 Endpoints Adicionales

### Obtener Exámenes por Usuario
```http
GET /api/exams/user/{userId}
```

**Parámetros**:
- `userId` (int): ID del usuario

### Obtener Examen para Estudiante
```http
GET /api/exams/{id}/student
```

**Parámetros**:
- `id` (int): ID del examen

### Obtener Intentos de Usuario
```http
GET /api/examattempts/user/{userId}
```

**Parámetros**:
- `userId` (int): ID del usuario

### Obtener Resultados de Examen
```http
GET /api/examattempts/exam/{examId}/results
```

**Parámetros**:
- `examId` (int): ID del examen

## 📊 Modelos de Datos

### Exam
```typescript
interface Exam {
  id: number;
  title: string;
  description?: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  createdByUserId: number;
  createdByUserName: string;
  questions: Question[];
}
```

### Question
```typescript
interface Question {
  id: number;
  text: string;
  type: string; // "MultipleChoice", "TrueFalse", "Text"
  points: number;
  order: number;
  options: QuestionOption[];
}
```

### QuestionOption
```typescript
interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
  order: number;
}
```

### ExamAttempt
```typescript
interface ExamAttempt {
  id: number;
  startedAt: string;
  completedAt?: string;
  score?: number;
  totalPoints?: number;
  status: string; // "InProgress", "Completed", "Abandoned"
  userId: number;
  userName: string;
  examId: number;
  examTitle: string;
  answers: Answer[];
}
```

### Answer
```typescript
interface Answer {
  id: number;
  textAnswer?: string;
  selectedOptionId?: number;
  booleanAnswer?: boolean;
  pointsEarned: number;
  answeredAt: string;
  questionId: number;
  questionText: string;
  selectedOptionText?: string;
}
```

## 🚨 Códigos de Error

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Validation failed for field 'title'"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "details": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "details": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "details": "Exam with ID 999 not found"
}
```

### 409 Conflict
```json
{
  "error": "Conflict",
  "details": "Exam attempt already exists for this user"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred"
}
```

## 🔒 Autenticación y Autorización

### JWT Token (Pendiente de Implementar)
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles de Usuario
- **Student**: Puede iniciar intentos de examen y ver sus resultados
- **Teacher**: Puede crear, editar y eliminar exámenes, ver todos los resultados
- **Admin**: Acceso completo al sistema

## 📈 Límites y Cuotas

### Límites de Rate
- **Requests por minuto**: 1000
- **Requests por hora**: 10000
- **Requests por día**: 100000

### Límites de Tamaño
- **Tamaño máximo de examen**: 50 preguntas
- **Tamaño máximo de pregunta**: 1000 caracteres
- **Tamaño máximo de opción**: 500 caracteres
- **Tamaño máximo de respuesta**: 2000 caracteres

## 🧪 Ejemplos de Uso

### Flujo Completo de Examen

#### 1. Obtener Exámenes Disponibles
```bash
curl -X GET "https://tu-app.azurewebsites.net/api/exams" \
  -H "Content-Type: application/json"
```

#### 2. Iniciar Intento de Examen
```bash
curl -X POST "https://tu-app.azurewebsites.net/api/examattempts/start" \
  -H "Content-Type: application/json" \
  -d '{"examId": 1}'
```

#### 3. Enviar Respuestas
```bash
curl -X POST "https://tu-app.azurewebsites.net/api/examattempts/1/answer" \
  -H "Content-Type: application/json" \
  -d '{"questionId": 1, "selectedOptionId": 2}'
```

#### 4. Finalizar Examen
```bash
curl -X POST "https://tu-app.azurewebsites.net/api/examattempts/1/complete" \
  -H "Content-Type: application/json"
```

### Crear Examen Completo

```bash
curl -X POST "https://tu-app.azurewebsites.net/api/exams" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Examen de Ciencias",
    "description": "Examen básico de ciencias naturales",
    "durationMinutes": 60,
    "startTime": "2024-01-01T10:00:00Z",
    "endTime": "2024-01-01T12:00:00Z",
    "questions": [
      {
        "text": "¿Cuál es el planeta más cercano al Sol?",
        "type": "MultipleChoice",
        "points": 10,
        "order": 1,
        "options": [
          {"text": "Venus", "isCorrect": false, "order": 1},
          {"text": "Mercurio", "isCorrect": true, "order": 2},
          {"text": "Tierra", "isCorrect": false, "order": 3}
        ]
      },
      {
        "text": "El agua está compuesta por hidrógeno y oxígeno",
        "type": "TrueFalse",
        "points": 5,
        "order": 2,
        "options": []
      }
    ]
  }'
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```bash
# Base de datos
ConnectionStrings__DefaultConnection="Server=localhost;Database=ExamSystemDb;Trusted_Connection=true;"

# Configuración de la aplicación
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=https://localhost:7000;http://localhost:5000

# CORS
AllowedOrigins=http://localhost:3000
```

### Configuración de CORS
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

## 📚 Documentación Adicional

### Swagger UI
La documentación interactiva está disponible en:
- **Desarrollo**: `https://localhost:7000/swagger`
- **Producción**: `https://tu-app.azurewebsites.net/swagger`

### Postman Collection
Una colección de Postman está disponible en el repositorio:
- **Ubicación**: `docs/postman/ExamSystem-API.postman_collection.json`
- **Variables**: `docs/postman/ExamSystem-API.postman_environment.json`

### SDKs y Clientes
- **JavaScript/TypeScript**: Axios, Fetch API
- **C#**: HttpClient, RestSharp
- **Python**: requests, httpx
- **Java**: OkHttp, Apache HttpClient

## 🚀 Mejoras Futuras

### Funcionalidades Pendientes
- [ ] Autenticación JWT
- [ ] Autorización basada en roles
- [ ] Validación de entrada mejorada
- [ ] Paginación en endpoints de lista
- [ ] Filtros y búsqueda avanzada
- [ ] Exportación de resultados
- [ ] Notificaciones en tiempo real
- [ ] Análisis avanzado de datos

### Optimizaciones
- [ ] Caching de consultas frecuentes
- [ ] Compresión de respuestas
- [ ] Rate limiting
- [ ] Logging estructurado
- [ ] Métricas de rendimiento
- [ ] Health checks
- [ ] Circuit breakers

---

**Última actualización**: $(date)
**Versión de API**: 1.0.0
**Autor**: Sistema de Exámenes en Línea Team

# AI FAQ Assistant API

RESTful FAQ Management API using Express, MongoDB/Mongoose, JWT authentication, and Google Gemini.

## Requirements

- Node.js 20 or newer
- MongoDB running locally or a reachable MongoDB instance
- A Gemini API key for the AI endpoints

## 1. Install

The ZIP includes the complete `src/` application source. You do not need to run `npm init -y` again.

```powershell
npm install
```

## 2. Configure `.env`

Copy `.env.example` to `.env` and set real values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_faq_assistant
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=replace_with_your_gemini_api_key
```

Do not commit `.env` or real API keys.

## 3. Start MongoDB

Make sure MongoDB is running, or set `MONGO_URI` to your MongoDB deployment.

## 4. Start the API

Development mode:

```powershell
npm run dev
```

Production-style start:

```powershell
npm start
```

Default API URL: `http://localhost:5000`

Health check: `GET http://localhost:5000/`

## 5. Run integration tests

```powershell
npm test
```

The integration tests require MongoDB. The AI endpoint tests accept either a successful Gemini response or a JSON error response when the AI service is not configured or unavailable. Test failures set a non-zero process exit code.

## 6. API routes

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile`

### FAQs
- POST `/api/faqs`
- GET `/api/faqs`
- GET `/api/faqs/:id`
- GET `/api/faqs/search?q=node`
- PUT `/api/faqs/:id`
- DELETE `/api/faqs/:id`

### AI
- POST `/api/ai/answer`
- POST `/api/ai/generate-faq`

The application uses CommonJS. The modern `@google/genai` SDK can be loaded with dynamic `import()` from CommonJS code.

## Security

- Keep `.env` out of version control.
- Use a long, random `JWT_SECRET` in real environments.
- Never commit `GEMINI_API_KEY`.
- If a key has been exposed, revoke/rotate it and replace the value in `.env`.

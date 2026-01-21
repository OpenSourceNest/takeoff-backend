# Takeoff Event Registration API

Backend API for the Takeoff event registration system built with Express.js, Prisma, and PostgreSQL.

## 🚀 Base URL

- **Development**: `http://localhost:4500`
- **Production**: `https://takeoff.opensourcenest.org` (TBD)

---

## 📋 API Endpoints

### Event Registration

#### 1. Create Registration
Register a new participant for the event.

**Endpoint**: `POST /api/events/register`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "isCommunityMember": true,
  "communityDetails": "Open Source Nest",
  "profession": "FULLSTACK_DEVELOPER",
  "professionOther": null,
  "location": "Lagos, Nigeria",
  "locationOther": null,
  "referralSource": "SOCIAL_MEDIA",
  "newsletterSub": true,
  "pipelineInterest": "YES",
  "interests": "React, TypeScript, AI",
  "openSourceKnowledge": 8
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "clxyz123...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "isCommunityMember": true,
    "profession": "FULLSTACK_DEVELOPER",
    "professionOther": null,
    "location": "Lagos, Nigeria",
    "locationOther": null,
    "referralSource": "SOCIAL_MEDIA",
    "openSourceKnowledge": 8,
    "createdAt": "2026-01-14T12:00:00.000Z"
  }
}
```

**Error Responses**:

- **400 Bad Request** - Validation error
```json
{
  "success": false,
  "error": "Invalid email format",
  "validationErrors": [
    {
      "code": "invalid_string",
      "message": "Invalid email format",
      "path": ["email"]
    }
  ]
}
```

- **409 Conflict** - Email already registered
```json
{
  "success": false,
  "error": "This email address is already registered."
}
```

---

#### 2. Get All Registrations
Retrieve all event registrations.

**Endpoint**: `GET /api/events/registrations`

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "clxyz123...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "isCommunityMember": true,
      "role": "FULLSTACK_DEVELOPER",
      "roleOther": null,
      "location": "Lagos, Nigeria",
      "locationOther": null,
      "openSourceKnowledge": 8,
      "createdAt": "2026-01-14T12:00:00.000Z"
    }
  ]
}
```

---

#### 3. Get Single Registration
Retrieve a specific registration by ID.

**Endpoint**: `GET /api/events/registrations/:id`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clxyz123...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    ...
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "error": "Registration not found."
}
```

---

#### 4. Update Registration
Update an existing registration.

**Endpoint**: `PUT /api/events/registrations/:id`

**Request Body** (all fields optional):
```json
{
  "firstName": "Updated Name",
  "openSourceKnowledge": 9
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clxyz123...",
    "firstName": "Updated Name",
    ...
  }
}
```

---

##  Available Professions

Total: **32 roles**

### General (2)
- `PROFESSIONAL_DEVELOPER`
- `HOBBYIST`

### Development (6)
- `FRONTEND_DEVELOPER`
- `BACKEND_DEVELOPER`
- `FULLSTACK_DEVELOPER`
- `DEVOPS_ENGINEER`
- `QA_ENGINEER`
- `SECURITY_ENGINEER`

### Data & AI (2)
- `DATA_SCIENTIST`
- `AI_ML_ENGINEER`

### Design & Product (3)
- `UI_UX_DESIGNER`
- `PRODUCT_MANAGER`
- `PROJECT_MANAGER`

### Web3 & Blockchain (10)
- `SMART_CONTRACT_DEVELOPER`
- `BLOCKCHAIN_DEVELOPER`
- `WEB3_DEVELOPER`
- `SOLIDITY_DEVELOPER`
- `DAPP_DEVELOPER`
- `TOKENOMICS_SPECIALIST`
- `NFT_DEVELOPER`
- `DEFI_DEVELOPER`
- `WEB3_SECURITY_AUDITOR`
- `BLOCKCHAIN_ARCHITECT`

### Content & Community (3)
- `TECHNICAL_WRITER`
- `CONTENT_CREATOR`
- `COMMUNITY_MANAGER`

### Business & Support (3)
- `FOUNDER`
- `IT_SUPPORT`
- `BUSINESS_ANALYST`

### Education (2)
- `STUDENT`
- `EDUCATOR`

### Other (1)
- `OTHER` - Use `professionOther` field to specify

### Complete List (Alphabetical)

```
AI_ML_ENGINEER
BACKEND_DEVELOPER
BLOCKCHAIN_ARCHITECT
BLOCKCHAIN_DEVELOPER
BUSINESS_ANALYST
COMMUNITY_MANAGER
CONTENT_CREATOR
DATA_SCIENTIST
DAPP_DEVELOPER
DEFI_DEVELOPER
DEVOPS_ENGINEER
EDUCATOR
FOUNDER
FRONTEND_DEVELOPER
FULLSTACK_DEVELOPER
HOBBYIST
IT_SUPPORT
NFT_DEVELOPER
OTHER
PRODUCT_MANAGER
PROFESSIONAL_DEVELOPER
PROJECT_MANAGER
QA_ENGINEER
SECURITY_ENGINEER
SMART_CONTRACT_DEVELOPER
SOLIDITY_DEVELOPER
STUDENT
TECHNICAL_WRITER
TOKENOMICS_SPECIALIST
UI_UX_DESIGNER
WEB3_DEVELOPER
WEB3_SECURITY_AUDITOR
```

---

## ✅ Validation Rules

### Required Fields
- `firstName` - min 1 character (trimmed)
- `lastName` - min 1 character (trimmed)
- `email` - valid email format (auto-lowercased)
- `isCommunityMember` - boolean
- `profession` - must be one of the valid professions above
- `location` - any string
- `openSourceKnowledge` - number between 1-10

### Optional Fields
- `professionOther` - string (required if profession is "OTHER")
- `locationOther` - string (for custom locations)
- `communityDetails` - string
- `referralSource` - enum
- `newsletterSub` - boolean
- `pipelineInterest` - enum
- `interests` - string

### Auto-Transformations
- `email` → trimmed and lowercased
- `firstName` → trimmed
- `lastName` → trimmed
- `openSourceKnowledge` → coerced to number

---

## 🔧 Field Types

```typescript
{
  firstName: string;           // Required, min 1 char
  lastName: string;            // Required, min 1 char
  email: string;               // Required, valid email
  isCommunityMember: boolean;  // Required
  profession: Profession;      // Required, enum
  professionOther: string | null; // Optional
  location: string;            // Required
  locationOther: string | null;// Optional
  referralSource: ReferralSource; // Optional
  newsletterSub: boolean;      // Optional
  pipelineInterest: PipelineInterest; // Optional
  interests: string | null;    // Optional
  openSourceKnowledge: number; // Required, 1-10
}
```

---

##  Email Notifications

Upon successful registration, a welcome email is automatically sent to the registrant's email address.

**Email Template**:
- **Subject**: "Welcome to Takeoff Event!"
- **Content**: Personalized welcome message with registrant's first name

---

## 🧪 Testing

### Using cURL

```bash
curl -X POST http://localhost:4500/api/events/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "isCommunityMember": true,
    "profession": "FRONTEND_DEVELOPER",
    "professionOther": null,
    "location": "Remote",
    "locationOther": null,
    "openSourceKnowledge": 7
  }'
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:4500/api/events/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    isCommunityMember: true,
    profession: 'FRONTEND_DEVELOPER',
    professionOther: null,
    location: 'Remote',
    locationOther: null,
    openSourceKnowledge: 7,
  }),
});

const data = await response.json();
console.log(data);
```

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Environment Variables

Create a `.env` file:

```env
PORT=4500
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_TIMEOUT=60000
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

Server will start on `http://localhost:4500`

---

## 🏗️ Architecture
This project follows a 3-layer architecture for better separation of concerns and testability:
1.  **Controller Layer** (`src/controllers`): Handles HTTP requests, validation, and responses. Lean and focused.
2.  **Service Layer** (`src/services`): Contains business logic and handles database interactions using Prisma.
3.  **Data Access Layer**: Prisma Client acting as the ORM.

It also features **Global Error Handling** via middleware to ensure consistent API responses.

---

## 🏗️ Tech Stack

- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod
- **Email**: Nodemailer
- **Language**: TypeScript
- **Testing**: Vitest + Supertest

---

## 🤝 Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide to get started.

To run tests locally:
```bash
npm test
```

## 📂 Project Structure

```
takeoff-backend/
├── src/
│   ├── controllers/
│   │   └── eventController.ts    # Request handlers (lean)
│   ├── services/
│   │   └── eventService.ts       # Business logic & DB calls
│   ├── routes/
│   │   └── eventRoutes.ts        # API routes
│   ├── schemas/
│   │   └── event.schema.ts       # Zod validation schemas
│   ├── middleware/
│   │   └── errorHandler.ts       # Global error handling
│   ├── lib/
│   │   └── prisma.ts             # Prisma client
│   └── utils/
│       ├── AppError.ts           # Custom error class
│       └── asyncHandler.ts       # Async wrapper
├── prisma/
│   └── schema.prisma             # Database schema
├── src/tests/                    # Integration tests
├── app.ts                        # Main app file
└── .env                          # Environment variables
```

---

## 🐛 Common Issues

### Email not sending?
- Check SMTP credentials in `.env`
- Ensure Gmail "App Passwords" is used (not regular password)
- Check server logs for email errors

### Validation errors?
- Ensure all required fields are provided
- Verify `profession` is exactly one of the valid enum values (case-sensitive)
- Check `openSourceKnowledge` is between 1-10

### CORS errors?
- Allowed origins in development: `localhost:4500`, `localhost:3001`, `localhost:5173`, `localhost:8080`
- Contact backend team to add your frontend URL

---

## 📞 Support

For questions or issues, contact the backend team or create an issue in the repository.

**Repository**: [https://github.com/OpenSourceNest/takeoff-backend](https://github.com/OpenSourceNest/takeoff-backend)
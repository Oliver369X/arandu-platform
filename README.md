# ARANDU - Intelligent Educational Platform

## 📋 General Description

ARANDU is a modern educational platform that combines **Adaptive Artificial Intelligence** with **Blockchain technology** to enhance learning for teachers and students. The platform offers immutable certifications, personalized learning, and a revolutionary educational experience.

## 🏗️ Project Architecture

### Technology Stack
- **Frontend**: Next.js 15.2.4 with React 19
- **UI Framework**: Shadcn/ui with Tailwind CSS
- **Authentication**: Hybrid system (email + Web3 wallet)
- **State Management**: React Hooks + Context API
- **TypeScript**: Full type safety
- **Theme**: Light/dark mode support

### Folder Structure
```
arandu-platform/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── blockchain/        # Blockchain information
│   ├── certificates/      # Certificates
│   ├── community/         # Community and forums
│   ├── course/           # Course player
│   ├── courses/          # Course catalog
│   ├── dashboard/        # Dashboards (student/teacher)
│   ├── messages/         # Messaging system
│   ├── notifications/    # Notifications
│   ├── profile/          # User profile
│   └── quiz/             # Assessment system
├── components/           # Reusable components
│   ├── layout/          # Header, Footer, etc.
│   ├── pages/           # Page components
│   └── ui/              # Base UI components
├── hooks/               # Custom hooks
├── lib/                 # Utilities and constants
└── types/               # TypeScript definitions
```

## 🎯 Views and Implemented Features

### 1. 🏠 Home Page (`/`)
**Status**: ✅ **FULLY IMPLEMENTED**

**Features**:
- Hero section with call to action
- Benefits section (Personalized AI, Blockchain Certificates, 24/7 Access)
- Platform statistics (10K+ students, 500+ courses, etc.)
- Responsive and modern design
- Light/dark mode support

**Component**: `components/pages/home-page.tsx`

### 2. 🔐 Authentication System (`/auth`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Views**:
- **Login** (`/auth/login`): Email and Web3 wallet authentication
- **Register** (`/auth/register`): Account creation with roles

**Features**:
- Dual authentication (email/password + wallet)
- Automatic role detection (student/teacher)
- Session persistence in localStorage
- Automatic redirection based on role

**Component**: `components/pages/auth-pages.tsx`
**Hook**: `hooks/use-auth.ts`

### 3. 📊 Student Dashboard (`/dashboard/student`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Overview**: Progress summary, active courses, statistics
- **My Courses**: List of enrolled courses with progress
- **Progress**: Progress charts and study time
- **Certificates**: Obtained and in-progress certificates
- **Recent Activity**: Latest activities and achievements
- **Weekly Goals**: Study objective tracking

**Backend Integration**:
- ✅ API service configured (`lib/api.ts`)
- ✅ Course service implemented (`lib/course-service.ts`)
- ✅ AI service for progress analysis (`lib/ai-service.ts`)
- ⚠️ Currently using mock data due to backend connectivity issues

**Component**: `components/pages/student-dashboard.tsx`

### 4. 👨‍🏫 Teacher Dashboard (`/dashboard/teacher`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Overview**: Course summary, students, revenue
- **Course Management**: Create, edit, publish courses
- **Student Analysis**: Progress, grades, engagement
- **Content**: Upload videos, documents, create lessons
- **Assessments**: Create and manage quizzes
- **Reports**: Performance metrics and analytics

**Component**: `components/pages/teacher-dashboard.tsx`

### 5. 🎓 Course Player (`/course/[id]`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PARTIAL**

**Features**:
- **Video Player**: Playback controls
- **Lesson List**: Navigation between modules
- **Progress**: Track completed lessons
- **Notes**: Note-taking system per lesson
- **Downloads**: Downloadable content
- **Comments**: Comment system per lesson
- **AI Content Tab**: AI-generated educational content

**Backend Integration**:
- ✅ API endpoints configured for course data
- ✅ AI content generation service integrated
- ⚠️ Currently using mock data due to backend connectivity
- ✅ Error handling for API failures implemented

**Component**: `components/pages/course-player.tsx`

### 6. 📝 Assessment System (`/quiz/[id]`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Question Types**: Single choice, multiple choice
- **Timer**: Time control per assessment
- **Progress**: Completed questions indicator
- **Results**: Immediate feedback with explanations
- **Attempts**: Control of allowed attempts
- **Certification**: Certificate generation upon passing

**Backend Integration**:
- ✅ AI service for quiz generation (`lib/ai-service.ts`)
- ⚠️ Currently using mock data
- ✅ Quiz generation from AI content implemented

**Component**: `components/pages/quiz-page.tsx`

### 7. 📚 Course Catalog (`/courses`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Filters**: By category, level, price, instructor
- **Search**: Search by title and description
- **Sorting**: By popularity, price, date
- **Detail View**: Complete course information
- **Enrollment**: Registration system

**Backend Integration**:
- ✅ API service configured for course listing
- ⚠️ Currently using mock data

**Component**: `components/pages/courses-page.tsx`

### 8. 🏆 Certificates (`/certificates`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Blockchain Verification**: Immutable certificates
- **Download**: PDF certificates
- **Share**: Public verification links
- **History**: All obtained certificates

**Component**: `components/pages/certificates-page.tsx`

### 9. 💬 Messaging System (`/messages`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Real-time Chat**: Instant messaging
- **Conversations**: Active chat list
- **Files**: Share documents and multimedia
- **Notifications**: New message alerts

**Component**: `components/pages/messages-page.tsx`

### 10. 🔔 Notifications (`/notifications`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Push Notifications**: Real-time alerts
- **Filters**: By type and status (read/unread)
- **Mark as Read**: State management
- **Settings**: Notification preferences

**Component**: `components/pages/notifications-page.tsx`

### 11. 👤 User Profile (`/profile`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Personal Information**: Edit basic data
- **Account Settings**: Change password, email
- **Preferences**: Notification settings
- **Wallet**: Web3 wallet management
- **Privacy**: Visibility settings

**Component**: `components/pages/profile-page.tsx`

### 12. 🌐 Community (`/community`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Forums**: Discussions by category
- **Q&A**: Question and answer system
- **Voting**: Voting system
- **Search**: Find relevant discussions

**Component**: `components/pages/community-page.tsx`

### 13. ⛓️ Blockchain Information (`/blockchain`)
**Status**: ✅ **FRONTEND IMPLEMENTED** | ⚠️ **BACKEND INTEGRATION PENDING**

**Features**:
- **Certificate Explorer**: View certificates on blockchain
- **Technical Information**: Implementation details
- **Transactions**: Transaction history
- **Verification**: Verification tools

**Component**: `components/pages/blockchain-page.tsx`

## 🔧 System Components

### Layout and Navigation
- **Header** (`components/layout/header.tsx`): Main navigation, notifications, profile
- **Footer** (`components/layout/footer.tsx`): Platform links and information
- **ThemeProvider** (`components/theme-provider.tsx`): Light/dark theme management

### Custom Hooks
- **useAuth** (`hooks/use-auth.ts`): Authentication and session management
- **useToast** (`hooks/use-toast.ts`): Toast notification system
- **useMobile** (`hooks/use-mobile.ts`): Mobile device detection

### TypeScript Types
- **User**: User information with roles
- **Course**: Course and module structure
- **Certificate**: Blockchain certificates
- **Progress**: Student progress
- **ForumPost**: Forum system

## 🚧 Current Development Status

### ✅ **FULLY IMPLEMENTED (Frontend)**
- All main views
- Authentication system (frontend)
- Complete dashboards
- Course player
- Assessment system
- Modern and responsive UI/UX
- Dark mode support
- Complete navigation
- AI integration components
- Error handling and fallbacks

### ⚠️ **PENDING DEVELOPMENT**
- **Backend API**: All functionalities currently use mock data
- **Database**: Not implemented
- **Real Authentication**: Current system is simulated
- **Blockchain Integration**: Certificates not on real blockchain
- **Web3 Wallet**: Real wallet connection
- **Video Streaming**: Real video player
- **Real-time Chat**: WebSockets not implemented
- **Push Notifications**: Real notification system

## 🔗 Backend Requirements

### 1. **Required REST API Endpoints**

#### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/wallet
POST /api/auth/logout
GET /api/auth/me
```

#### Users
```
GET /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
GET /api/users/:id/progress
```

#### Courses
```
GET /api/courses
GET /api/courses/:id
POST /api/courses
PUT /api/courses/:id
DELETE /api/courses/:id
GET /api/courses/:id/modules
POST /api/courses/:id/enroll
GET /api/courses/:id/progress
```

#### Modules and Content
```
GET /api/modules/:id
POST /api/modules
PUT /api/modules/:id
DELETE /api/modules/:id
POST /api/modules/:id/complete
```

#### Assessments
```
GET /api/quizzes
GET /api/quizzes/:id
POST /api/quizzes
PUT /api/quizzes/:id
DELETE /api/quizzes/:id
POST /api/quizzes/:id/submit
GET /api/quizzes/:id/results
```

#### Certificates
```
GET /api/certificates
GET /api/certificates/:id
POST /api/certificates
GET /api/certificates/verify/:tokenId
```

#### Messaging
```
GET /api/messages
GET /api/messages/:conversationId
POST /api/messages
PUT /api/messages/:id/read
```

#### Notifications
```
GET /api/notifications
PUT /api/notifications/:id/read
PUT /api/notifications/settings
```

### 2. **Required Database**

#### Main Tables
- **users**: User information
- **courses**: Available courses
- **modules**: Course modules
- **enrollments**: Student enrollments
- **progress**: Student progress
- **quizzes**: Assessments
- **quiz_attempts**: Assessment attempts
- **certificates**: Issued certificates
- **messages**: Messaging system
- **notifications**: Notifications
- **forum_posts**: Forum posts
- **forum_replies**: Forum replies

### 3. **Required External Services**

#### Blockchain
- **Smart Contract**: For NFT certificates
- **Web3 Provider**: Blockchain network connection
- **IPFS**: Certificate metadata storage

#### Multimedia
- **Video Streaming**: Video service (AWS S3, CloudFront)
- **File Storage**: File storage
- **CDN**: Content distribution

#### Communication
- **WebSockets**: Real-time chat
- **Push Notifications**: Push notifications
- **Email Service**: Email notifications

#### AI and Analytics
- **Machine Learning**: Personalized recommendations
- **Analytics**: Usage and progress metrics
- **Content Moderation**: Content moderation

### 4. **Web3 Integrations**

#### Wallet Integration
- **MetaMask**: Primary connection
- **WalletConnect**: Multi-platform support
- **Signing**: Transaction signing

#### Smart Contracts
- **Certificate NFT**: ERC-721 for certificates
- **Governance**: Governance system
- **Staking**: Staking system for incentives

## 🎯 Next Development Steps

### Phase 1: Basic Backend (2-3 weeks)
1. **REST API**: Implement basic endpoints
2. **Database**: Design and create schema
3. **Real Authentication**: JWT + middleware
4. **File Upload**: File system

### Phase 2: Core Features (3-4 weeks)
1. **Course System**: Complete CRUD
2. **Video Player**: Real streaming
3. **Assessments**: Functional quiz system
4. **Progress**: Real progress tracking

### Phase 3: Blockchain Integration (2-3 weeks)
1. **Smart Contracts**: Contract development
2. **NFT Certificates**: Certificate minting
3. **Wallet Integration**: Real wallet connection
4. **Verification**: Verification system

### Phase 4: Communication and AI (2-3 weeks)
1. **Real-time Chat**: WebSockets
2. **Notifications**: Push system
3. **AI Recommendations**: Basic ML
4. **Analytics**: Metrics and reports

## 📊 Development Metrics

- **Frontend Complete**: 100% ✅
- **Backend API**: 0% ❌
- **Database**: 0% ❌
- **Blockchain**: 0% ❌
- **Integration**: 0% ❌

**Estimated Time for MVP**: 8-10 weeks
**Estimated Time for Production**: 12-16 weeks

## 🚀 How to Run the Project

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Run in production
npm start
```

## 📝 Important Notes

1. **Mock Data**: All functionalities use simulated data
2. **Authentication**: Simulated system, no backend required
3. **Responsive**: Design optimized for mobile and desktop
4. **Accessibility**: Accessible components with ARIA labels
5. **Performance**: Optimized with Next.js 15 and React 19
6. **AI Integration**: AI services configured but using fallbacks due to backend connectivity
7. **Error Handling**: Comprehensive error handling for API failures

---

**ARANDU** - Transforming education with AI and Blockchain 🚀

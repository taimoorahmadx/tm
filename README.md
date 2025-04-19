# EduTech Platform

A modern, AI-powered educational platform that connects teachers and students through interactive learning experiences.

## Features

- 🎓 Course Creation and Management
- 🎥 Video Upload with AI-powered Transcription
- 💬 Real-time Chat and Discussion
- 🔍 Advanced Course Search and Discovery
- 💳 Secure Payment Integration
- 🌐 Interactive 3D Landing Page
- 📱 Responsive Design

## Tech Stack

- **Frontend**: Next.js, React, Three.js, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **AI Services**: OpenAI API
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **Storage**: AWS S3

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- AWS Account (for S3 storage)
- OpenAI API Key
- Stripe Account

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm run dev
```

## Project Structure

```
edutech-platform/
├── frontend/                 # Next.js frontend application
│   ├── components/          # Reusable React components
│   ├── pages/              # Next.js pages
│   ├── public/             # Static assets
│   ├── styles/             # Global styles
│   └── utils/              # Utility functions
├── backend/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
└── README.md              # Project documentation
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 
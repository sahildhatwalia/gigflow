# crud
# GigFlow

GigFlow is a gig/freelance marketplace web app where users can post gigs and find work — built on the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- Post a gig — clients can create and publish gig listings
- Browse & find gigs — freelancers can search and discover available work
- User authentication (sign up / log in)
- RESTful API backend for managing gigs and users
- Responsive React frontend

## Tech Stack

**Frontend:** React.js
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)

## Project Structure

```
gigflow/
├── frontend/           # React client
└── practice_backend/   # Express + MongoDB API server
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local instance or a MongoDB Atlas connection string)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/sahildhatwalia/gigflow.git
   cd gigflow
   ```

2. Set up the backend
   ```bash
   cd practice_backend
   npm install
   ```
   Create a `.env` file in `practice_backend/` with your MongoDB connection string and any other required environment variables (e.g. `MONGO_URI`, `JWT_SECRET`).

3. Set up the frontend
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

Start the backend:
```bash
cd practice_backend
npm start
```

Start the frontend (in a separate terminal):
```bash
cd frontend
npm start
```

The React app will typically run on `http://localhost:3000` and the API server on the port defined in your backend config (e.g. `http://localhost:5000`).

## Roadmap

- [ ] Gig application / bidding flow
- [ ] Messaging between clients and freelancers
- [ ] Payment integration
- [ ] Ratings and reviews

## Author

**Sahil Dhatwalia**
[GitHub](https://github.com/sahildhatwalia) · [LinkedIn](https://linkedin.com/in/sahil-b4850731b)

## License

This project currently has no license specified.
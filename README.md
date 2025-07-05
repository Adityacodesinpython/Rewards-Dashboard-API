# Rewards Dashboard API

A backend API built with **NestJS** and **MongoDB (Atlas)** to support a rewards dashboard. Features include user rewards, transactions, redemption, analytics, real-time updates (WebSocket), and Redis caching.

---

## 🚀 Features
- **User Management** (mocked, no authentication)
- **Rewards Management**
  - Get total reward points
  - List transactions (with pagination)
  - Redeem points for options (cashback, vouchers, etc.)
  - List available reward options
- **Analytics**
  - Rewards distribution by category
- **WebSocket**
  - Real-time updates on reward points
- **Redis Caching**
  - Fast access to reward options
- **Swagger/OpenAPI**
  - Interactive API docs at `/api`

---

## 🏗️ Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in:
     ```env
     MONGO_URI=your_mongodb_atlas_uri
     REDIS_URL=redis://localhost:6379
     ```
4. **Start the app**
   ```sh
   npm run start:dev
   ```
5. **Access Swagger docs**
   - Visit [http://localhost:3000/api](http://localhost:3000/api)

---

## 📚 API Endpoints & Examples

### Rewards

#### `GET /rewards/points?userId=...`
**Request:**
```
GET /rewards/points?userId=60f7c2b8e1d2c8a1b8e1d2c8
```
**Response:**
```json
{
  "userId": "60f7c2b8e1d2c8a1b8e1d2c8",
  "totalPoints": 1200
}
```

---

#### `GET /rewards/transactions?userId=...&page=1&limit=5`
**Request:**
```
GET /rewards/transactions?userId=60f7c2b8e1d2c8a1b8e1d2c8&page=1&limit=2
```
**Response:**
```json
[
  {
    "_id": "60f7c2b8e1d2c8a1b8e1d2d1",
    "userId": "60f7c2b8e1d2c8a1b8e1d2c8",
    "amount": 100,
    "category": "purchase",
    "pointsEarned": 100,
    "timestamp": "2024-06-01T12:00:00.000Z"
  },
  {
    "_id": "60f7c2b8e1d2c8a1b8e1d2d2",
    "userId": "60f7c2b8e1d2c8a1b8e1d2c8",
    "amount": 200,
    "category": "signup",
    "pointsEarned": 200,
    "timestamp": "2024-06-02T12:00:00.000Z"
  }
]
```

---

#### `POST /rewards/redeem`
**Request:**
```
POST /rewards/redeem
Content-Type: application/json

{
  "userId": "60f7c2b8e1d2c8a1b8e1d2c8",
  "optionId": "60f7c2b8e1d2c8a1b8e1d2e1"
}
```
**Response (Success):**
```json
{
  "message": "Redemption successful",
  "rewardType": "10$ Cashback",
  "pointsRedeemed": 1000
}
```
**Response (Insufficient Points):**
```json
{
  "statusCode": 400,
  "message": "Insufficient reward points",
  "error": "Bad Request"
}
```
**Response (Invalid Option):**
```json
{
  "statusCode": 404,
  "message": "Reward option not found",
  "error": "Not Found"
}
```

---

#### `GET /rewards/options`
**Request:**
```
GET /rewards/options
```
**Response:**
```json
[
  {
    "_id": "60f7c2b8e1d2c8a1b8e1d2e1",
    "name": "10$ Cashback",
    "costPoints": 1000,
    "description": "Get $10 cashback",
    "type": "cashback"
  },
  {
    "_id": "60f7c2b8e1d2c8a1b8e1d2e2",
    "name": "20% Discount Voucher",
    "costPoints": 500,
    "description": "20% off on next purchase",
    "type": "voucher"
  }
]
```

---

### Analytics

#### `GET /analytics/rewards-distribution`
**Request:**
```
GET /analytics/rewards-distribution
```
**Response:**
```json
[
  {
    "category": "purchase",
    "totalPoints": 100,
    "count": 1
  },
  {
    "category": "signup",
    "totalPoints": 200,
    "count": 1
  },
  {
    "category": "referral",
    "totalPoints": 150,
    "count": 1
  }
]
```

---

### WebSocket

#### Connect
- **URL:** `ws://localhost:3000` (Socket.IO)

#### Event: `rewardPointsUpdated`
**Payload Example:**
```json
{
  "userId": "60f7c2b8e1d2c8a1b8e1d2c8",
  "totalPoints": 200
}
```
**Client Example (JavaScript):**
```js
const socket = io('http://localhost:3000');
socket.on('rewardPointsUpdated', (data) => {
  console.log('Points updated:', data);
});
```

---

## 🏛️ Architecture
- **NestJS** modular structure: Rewards, Analytics, WebSocket Gateway
- **MongoDB (Atlas)** for persistent storage
- **Redis** for caching reward options
- **Swagger/OpenAPI** for documentation
- **Jest** for unit and integration testing
- **SeedService** for mock data on startup

---

## 📝 Additional Setup Considerations

- **Environment Variables:**
  - `MONGO_URI`: Your MongoDB Atlas connection string.
  - `REDIS_URL`: Your Redis connection string (e.g., `redis://localhost:6379`).
- **MongoDB Atlas:**
  - Ensure your cluster is running and accessible from your IP.
  - Create a database user with read/write access.
- **Redis:**
  - For local development, install Redis and ensure it's running on the default port.
  - For production, use a managed Redis service and secure your connection.
- **Ports:**
  - Default API port is `3000`. Change with the `PORT` env variable if needed.
- **Swagger Docs:**
  - All endpoints, request/response schemas, and error responses are documented at `/api`.
- **Testing:**
  - Run `npm run test` for unit tests and `npm run test:e2e` for integration tests.
- **Troubleshooting:**
  - If you see connection errors, check your MongoDB/Redis URIs and network/firewall settings.
  - For Windows users, ensure Redis is installed and running as a service or via Docker.
- **Extensibility:**
  - Add authentication, more analytics, or additional endpoints as needed.

---

# Smart LED Dashboard

A modern, interactive web dashboard for the **Smart Automatic Brightness Control LED Lighting System** - an undergraduate engineering research project at the University of Moratuwa.

 **Live Demo:** [https://yourusername.github.io/smart-led-dashboard](https://chanu23UOM.github.io/smart-led-dashboard)

##  Project Overview

This system addresses two critical issues in university study areas:
- **Asthenopia** (eye strain from poor lighting conditions)
- **Energy Inefficiency** (lights left on in empty rooms)

The smart LED system uses:
- **PIR Sensors** for occupancy detection
- **LDR Sensors** for ambient light measurement
- **PWM Control** for smooth brightness adjustment
- **EN 12464-1 Standard** compliance (500 Lux target for study areas)

##  Features

### Live Dashboard
- Real-time sensor data streaming via Socket.io
- Current occupancy display
- Ambient light radial gauge (0-1000 Lux)
- System status indicators (Energy Saving / Active)
- LED array visualization with glow effects
- Interactive simulation mode

### Analytics
- Energy consumption comparison charts (Static vs Smart)
- Occupancy heatmap (Day × Hour)
- Light stability scatter plot
- Calculated energy savings (40-60%)

### Manual Control
- Toggle between Automatic and Manual modes
- Direct PWM control (0-255)
- Preset brightness levels
- Real-time power consumption display

### About Section
- System architecture diagram
- Control algorithm explanation
- EN 12464-1 standards reference

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Recharts** (Data Visualization)
- **Lucide React** (Icons)
- **Socket.io Client** (Real-time)

### Backend
- **Node.js** with **Express**
- **Socket.io** (WebSocket Server)
- **MongoDB** with **Mongoose**

## Project Structure

```
smart-led-dashboard/
├── backend/
│   ├── models/
│   │   ├── SensorLog.js      # MongoDB Schema
│   │   └── index.js
│   ├── routes/
│   │   └── api.js            # REST API endpoints
│   ├── server.js             # Express + Socket.io server
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── OccupancyCard.jsx
    │   │   ├── LuxGauge.jsx
    │   │   ├── StatusCard.jsx
    │   │   ├── EnergySavingsCard.jsx
    │   │   ├── SimulationPanel.jsx
    │   │   └── LEDVisualizer.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Analytics.jsx
    │   │   ├── ManualControl.jsx
    │   │   └── About.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already created with defaults)
# Edit if needed:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/smart_led_system

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Dashboard
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository named `smart-led-dashboard`

### Step 2: Update Configuration

Update the base URL in `frontend/vite.config.js` to match your repo name:
```js
base: '/smart-led-dashboard/', // Use your repo name
```

Update homepage in `frontend/package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/smart-led-dashboard"
```

### Step 3: Push to GitHub

```bash
cd smart-led-dashboard
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-led-dashboard.git
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under "Build and deployment", select **Source: GitHub Actions**
3. The workflow will automatically build and deploy on push

### Step 5: Access Your Site

Your dashboard will be live at: `https://YOUR_USERNAME.github.io/smart-led-dashboard`

### Demo Mode

When deployed to GitHub Pages (without backend), the dashboard automatically runs in **Demo Mode**:
- Purple "Demo" indicator in navbar
- Simulated sensor data generated locally
- All features work including simulation controls
- No backend/database required

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | Get all sensor logs (paginated) |
| GET | `/api/logs/latest` | Get latest sensor reading |
| POST | `/api/logs` | Create new sensor log |
| GET | `/api/analytics/hourly` | Get hourly aggregated data |
| GET | `/api/analytics/savings` | Get energy savings stats |
| GET | `/api/analytics/heatmap` | Get occupancy heatmap data |
| GET | `/api/analytics/stability` | Get light stability data |
| GET | `/api/stats` | Get system statistics |

## 🔌 Socket.io Events

### Client → Server
- `setSimulationMode` - Enable/disable simulation
- `updateSimulation` - Update simulation parameters
- `setManualMode` - Toggle manual control
- `setManualPWM` - Set PWM value in manual mode

### Server → Client
- `sensorData` - Real-time sensor readings (every 2s)

## MongoDB Schema

```javascript
{
  timestamp: Date,
  occupancyCount: Number (0-100),
  ambientLux: Number (0-1000),
  ledOutputPWM: Number (0-255),
  energyConsumedWatts: Number,
  mode: String ('automatic' | 'manual' | 'energy_saving'),
  targetLux: Number (default: 500)
}
```

## Design Features

- **Dark Mode** with Cyberpunk/Engineering aesthetic
- **Glassmorphism** effects on cards
- **Neon glow** animations
- **Responsive** design for all screen sizes
- **Real-time** LED brightness visualization

## License

This project is developed for educational purposes as part of an undergraduate research project.

## Credits

**ESD Research Project**  
Department of Electronic & Telecommunication Engineering  
University of Moratuwa, Sri Lanka

---

Made with 💡 for better study environments

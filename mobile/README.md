# Swiftion Mobile App

A React Native mobile application for Swiftion - AI-powered decision making.

## Features Implemented

### Onboarding Wizard (7 Steps)
The app features a comprehensive 7-step onboarding wizard that appears immediately after signup:

1. **Step 0: Provider Selection** - Choose AI provider (OpenRouter/Groq/Anthropic)
2. **Step 1: Basic Profile** - Name, age, gender, occupation, location, living situation
3. **Step 2: Health & Dietary** - Diet type, allergies, health goals, activity level
4. **Step 3: Work & Schedule** - Work hours, location, commute, stress level
5. **Step 4: Food Preferences** - Cuisines, budget, cooking habits, meal times
6. **Step 5: Task Management Style** - Energy peak, priority method, multitasking
7. **Step 6: Decision-Making Style** - Novelty preference, budget consciousness

### Authentication Flow
- Sign In with email/password
- Sign Up with email verification
- OTP verification (6-digit code)
- Automatic token management with AsyncStorage
- Auto-logout on token expiry

### Security Features
- JWT token persistence in AsyncStorage
- Token expiry detection and auto-logout
- Rate limiting protection (429 handling)
- Global error boundary
- Form validation on each step

### UI/UX
- Dark mode theme (zinc-950 background)
- Violet/purple accents (#8b5cf6)
- Progress indicators
- Back/Next navigation
- Form validation
- Loading states

## Project Structure

```
mobile/
├── App.js                          # Main app entry
├── package.json                    # Dependencies
├── app.json                        # Expo configuration
├── src/
│   ├── api/
│   │   ├── client.js              # Axios client with interceptors
│   │   └── endpoints.js           # API endpoints
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   └── index.js           # Card, Input, Select, MultiSelect, Slider
│   │   ├── onboarding/            # Onboarding step components
│   │   │   ├── Step0ProviderSelection.js
│   │   │   ├── Step1BasicProfile.js
│   │   │   ├── Step2HealthDietary.js
│   │   │   ├── Step3WorkSchedule.js
│   │   │   ├── Step4FoodPreferences.js
│   │   │   ├── Step5TaskManagement.js
│   │   │   └── Step6DecisionStyle.js
│   │   └── ErrorBoundary.js       # Global error handler
│   ├── context/
│   │   └── AuthContext.js         # Auth state management
│   ├── navigation/
│   │   └── AppNavigator.js        # React Navigation setup
│   └── screens/
│       ├── LandingScreen.js       # App intro
│       ├── SignInScreen.js        # Login
│       ├── SignUpScreen.js        # Registration
│       ├── VerifyOTPScreen.js     # OTP verification
│       ├── OnboardingScreen.js    # Main onboarding container
│       └── DashboardScreen.js     # Post-onboarding dashboard
└── assets/                         # App icons and images
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android emulator) or Xcode (for iOS)

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
# or
expo start
```

4. Run on device/emulator:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app on physical device

### Building for Production

#### Android APK
```bash
# Configure EAS
npx eas build:configure

# Build APK
npx eas build -p android --profile preview
```

#### iOS (requires Apple Developer account)
```bash
npx eas build -p ios
```

## API Integration

The mobile app communicates with the backend at:
```
https://swiftion.vercel.app/api
```

**IMPORTANT**: Mobile → Backend → AI Provider
- Never call OpenRouter/Groq/Anthropic directly from mobile
- All AI requests go through the backend proxy
- This prevents API key exposure in the APK

### Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Sign in |
| `/auth/register` | POST | Sign up |
| `/auth/verify-otp` | POST | Verify email |
| `/auth/resend-otp` | POST | Resend OTP |
| `/auth/onboarding/complete` | POST | Complete onboarding |

## Data Validation

Each step validates required fields before allowing progression:
- **Step 0**: Provider selection (required)
- **Step 1**: Name, age, gender, occupation, location, living situation
- **Step 2**: Dietary type, health goal, activity level, eating pattern, allergies
- **Step 3**: Work schedule, location, commute, lunch break, daily schedule, stress level
- **Step 4**: Cuisines (1-4), budget, cooking habits, spice tolerance, eating styles (1-3)
- **Step 5**: Energy peak, priority method, work blocks, multitasking style, procrastination
- **Step 6**: Novelty, budget consciousness, time availability, decision confidence

## Error Handling

### Global Error Boundary
Catches React rendering errors and displays a user-friendly error screen with retry option.

### API Error Handling
- **401 Unauthorized**: Auto-logout with alert
- **429 Rate Limited**: Shows retry timer
- **Network Errors**: Displays appropriate error messages

### Form Validation
- Real-time validation on step progression
- Alert dialogs for incomplete fields
- Visual indicators for required fields

## State Management

### Auth Context
- User state
- Authentication status
- Token management
- Onboarding status

### Onboarding Form State
- Single complex state object
- Updates via `updateStepData` function
- Validation before submission

## Styling Guide

### Colors
- Background: `#09090b` (zinc-950)
- Surface: `#18181b` (zinc-900)
- Border: `#27272a` (zinc-800)
- Accent: `#8b5cf6` (violet-500)
- Text Primary: `#fafafa` (zinc-50)
- Text Secondary: `#a1a1aa` (zinc-400)
- Text Muted: `#71717a` (zinc-500)

### Typography
- Font: System default (Inter-like)
- Headings: 24px, bold
- Body: 16px, regular
- Labels: 14px, medium

### Components
- Cards: 12px border radius, 1px border
- Inputs: 8px border radius, zinc-900 background
- Buttons: 8-10px border radius, violet background
- Pills: 20px border radius, multi-select

## Future Enhancements

### Planned Features
1. Decision Screen - Get AI recommendations
2. History Screen - View past decisions
3. Settings Screen - Update AI keys and profile
4. Push Notifications
5. Offline support with AsyncStorage caching
6. Pull-to-refresh on Dashboard
7. Loading skeletons
8. Debounced API requests

### Performance Optimizations
- Image optimization
- API response caching
- Lazy loading for history
- Code splitting

## Troubleshooting

### Metro bundler issues
```bash
npx expo start -c  # Clear cache
```

### Android build issues
```bash
cd android && ./gradlew clean && cd ..
```

### iOS build issues
```bash
cd ios && pod install && cd ..
```

## License

MIT License - See main project LICENSE file

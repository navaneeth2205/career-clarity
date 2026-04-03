# Test Page Implementation Documentation

## Overview
A complete React frontend component suite for career guidance tests with dynamic test selection, security features, and comprehensive API integration.

## Features Implemented

### 1. Dynamic Test Flow
- **Automatic Detection**: Checks if user has attempted quick test via `GET /api/test/quick/`
- **Conditional Rendering**: 
  - If quick test NOT attempted → displays Quick Test
  - If quick test attempted → displays Skill Test
- **Seamless Transition**: After quick test completion, user can directly start skill test

### 2. Quick Test Component
- **Display**: 8 questions (5 general + 3 interest-based)
- **Features**:
  - Multiple choice options (A, B, C, D)
  - Visual answer selection indicator
  - Progress bar and percentage tracker
  - Question navigation (Previous/Next)
  - Answer summary with visual indicators
  - 30-minute timer with auto-submit
  - Auto-submit when time expires
- **Submission**: `POST /api/test/quick/submit/` with answers dictionary

### 3. Skill Test Component
- **Display**: 15 skill-based questions (AI-generated if needed)
- **Security Features**:
  - ✅ Fullscreen mode enforcement
  - ✅ Copy/Paste disabled
  - ✅ Right-click disabled
  - ✅ Tab switching detection with visual warning
  - ✅ Warning modal before test starts
- **Features**:
  - 45-minute countdown timer
  - Time warning when < 5 minutes remaining
  - Question navigation
  - Answer tracking and summary
  - Fullscreen visual styling (dark mode)
  - Auto-submit on timeout
- **Submission**: `POST /api/test/test/skill/submit/` with answers and skill name

### 4. Result Display Page
- **Score Visualization**:
  - Total score and percentage
  - Animated progress display
  - Color-coded difficulty level (Beginner/Intermediate/Advanced)
- **Level Indicators**:
  - 🌱 Beginner (0-40%)
  - 📈 Intermediate (40-75%)
  - 🚀 Advanced (75-100%)
- **Recommendations** (Skill Test only):
  - Fetches from `GET /api/predict/`
  - Displays top 3 recommended careers
  - Shows ability assessment
  - Skill-based insights
- **Navigation**:
  - "View Career Recommendations" button
  - "Back to Dashboard" button

## Component Structure

```
src/
├── pages/
│   ├── TestPage.jsx              # Main test orchestrator
│   └── TestResultPage.jsx         # Result display component
├── components/
│   └── QuestionCard.jsx           # Reusable question display
└── services/
    └── testService.js            # Updated API service
```

## Component Details

### TestPage.jsx (Main Orchestrator)
**Responsibilities**:
- Test state management (loading, quickTest, skillTest, result, error)
- Initial quick test status check
- Test initialization and data fetching
- User answer tracking
- Timer management
- Security feature enforcement
- Test submission logic

**Key States**:
```javascript
- testState: 'loading' | 'quickTest' | 'skillTest' | 'result' | 'error'
- questions: Array of question objects
- answers: Object mapping question IDs to selected options
- currentQuestion: Index of current question
- timeRemaining: Seconds left on timer
- isFullscreen: Boolean for fullscreen mode
- skillTestStarted: Boolean for security enforcement
```

**Key Functions**:
- `checkTestStatus()`: Determines which test to show
- `initializeQuickTest()`: Set up quick test
- `initializeSkillTest()`: Set up skill test
- `enterFullscreen()`: Activate fullscreen mode
- `setupSecurityFeatures()`: Disable right-click, copy/paste, etc.
- `handleSelectAnswer()`: Track user selection
- `handleSubmitTest()`: Submit answers to API
- `handleAutoSubmit()`: Auto-submit when time expires

### QuestionCard.jsx (Question Component)
**Props**:
```javascript
{
  question: Object,              // Question data
  questionNumber: Number,        // Current question number
  totalQuestions: Number,        // Total questions
  selectedAnswer: String,        // Currently selected option
  onSelectAnswer: Function,      // Callback on selection
  disabled: Boolean              // Disable interactions
}
```

**Features**:
- Progress indicator
- Progress bar visualization
- Option selection with visual feedback
- Radio button style selection
- Checkmark on selected option

### TestResultPage.jsx (Result Component)
**Props**:
```javascript
{
  result: Object,       // Test result data
  testType: String      // 'quick' or 'skill'
}
```

**Features**:
- Score display and visualization
- Percentage calculation and display
- Level-based color coding
- Emoji-based level indication
- Predictions fetching for skill tests
- Navigation buttons

## API Integration

### Service Methods (testService.js)

```javascript
// Get quick test questions
getQuickTest() → Promise<{attempted: Boolean, questions: Array}>

// Submit quick test
submitQuickTest(answers) → Promise<{message: String}>

// Get skill test questions
getSkillTest() → Promise<{skill: String, total_questions: 15, questions: Array}>

// Submit skill test
submitSkillTest(answers, skill) → Promise<{score: Number, total: Number, level: String, message: String}>

// Get career predictions
getPredictions() → Promise<{ability: String, interest: Object, skills: Array, top_careers: Array}>
```

### Authorization
- JWT token automatically injected via `api.interceptors.request`
- Token stored in localStorage under key `authToken`
- Automatic token refresh on 401 response

## Security Features

### Fullscreen Mode
- Automatically enters fullscreen when skill test starts
- Enforced for test integrity
- ESC key can exit (with warning if modal is preferred)

### Copy/Paste Prevention
- `copy` event listener blocks copying
- `paste` event listener blocks pasting
- Shows alert message when attempted

### Right-Click Prevention
- `contextmenu` event listener disables right-click
- Shows alert message when attempted

### Tab Switching Detection
- `visibilitychange` event listener detects tab switches
- Shows red warning banner for 3 seconds when tab switched
- Warning persists throughout test

### Pre-Test Warning Modal
- Shows before skill test begins
- Lists all security/test rules
- Must confirm to start test
- Can cancel and return to dashboard

## Styling & UI

### Design System
- Tailwind CSS for all styling
- Glassmorphism effects (backdrop-blur)
- Gradient backgrounds
- Smooth animations and transitions
- Color-coded status indicators

### Animations
- `cc-fade-in`: Fade in with upward movement
- `animate-bounce`: Success animation for result
- `animate-spin`: Loading spinner

### Color Scheme
- Indigo/Blue: Quick Test
- Emerald/Teal: Skill Test & Results
- Red: Time warnings
- Green: Correct/Submit actions
- Slate: Neutral/Background

## State Flow Diagram

```
Loading
  ↓
Check Quick Test Status
  ├─ Attempted=false → Quick Test
  │   ├─ During Test
  │   └─ Submit → Result
  │       ├─ Recommendations
  │       └─ Back to Dashboard
  │
  └─ Attempted=true → Skill Test Warning
      ├─ Confirm → Fullscreen + Skill Test
      │   └─ During Test
      │       └─ Submit → Result
      │           ├─ Career Recommendations
      │           └─ Back to Dashboard
      │
      └─ Cancel → Dashboard
```

## Timer Logic

### Quick Test: 30 minutes
- Countdown starts immediately
- Auto-submit at 0:00
- Visual warning at < 5 minutes

### Skill Test: 45 minutes
- Countdown starts after fullscreen mode
- Auto-submit at 0:00
- Visual warning at < 5 minutes
- Red text color when warning active

## Error Handling

```javascript
// Network Errors
→ Display error message
→ Show "Back to Dashboard" button
→ Console log for debugging

// API Errors
→ Check response status
→ Show user-friendly message
→ Prevent submission if answer validation fails

// Test Load Errors
→ Fallback to error state
→ Button to retry or go back
```

## Responsive Design

- Mobile-first approach
- Works on all screen sizes
- Fullscreen mode disables responsive breaks
- Touch-friendly button sizes
- Readable font sizes on small devices

## Keyboard Navigation

- Tab key: Navigate between options
- Enter key: Select option
- Arrow keys: Can navigate (if implemented)
- ESC key: Exit fullscreen (during skill test)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Fullscreen API may have limited support on some browsers.

## Performance Optimizations

- Lazy loading of result predictions
- Minimal re-renders with proper state management
- Event listener cleanup on unmount
- Efficient question indexing

## Usage Examples

### Navigate to Test
```javascript
// From Dashboard or Navbar
navigate('/quick-test')  // Opens unified test page
navigate('/test')        // Alternative route
```

### Test Flow
1. User navigates to `/quick-test`
2. Page checks if quick test was attempted
3. If not: Shows quick test with 8 questions
4. After submission: Shows result page
5. User clicks "Take Skill Test" or navigates back
6. If taking skill test: Shows warning modal
7. After confirming: Enters fullscreen + skill test
8. After submission: Shows result with predictions

## Future Enhancements

1. Add analytics/tracking
2. Save answer progress locally
3. Question bookmarking
4. Answer explanations
5. Difficulty filtering
6. Practice mode
7. Historical score tracking
8. Timed practice sessions
9. Subject-wise analysis
10. Performance graphs

## Troubleshooting

### Fullscreen Not Working
- Check browser permissions
- Some browsers require user interaction first
- Try a different browser

### Security Features Not Working
- Page must be focused
- Reload page if listeners detached
- Check browser security policies

### Timer Not Showing
- Check if timeRemaining state is updating
- Verify timer interval is started
- Check console for errors

### Auto-Submit Not Triggering
- Verify handleAutoSubmit is called
- Check API response after submission
- Ensure state cleanup is proper

## Testing Checklist

- [ ] Quick test loads with 8 questions
- [ ] Quick test answers are tracked
- [ ] Quick test submits successfully
- [ ] Skill test shows warning modal
- [ ] Fullscreen activates on skill test start
- [ ] Copy/paste disabled during skill test
- [ ] Right-click disabled during skill test
- [ ] Tab switch shows warning
- [ ] Timer counts down correctly
- [ ] Auto-submit triggers at 0:00
- [ ] Results display correctly
- [ ] Level badges show correct emoji
- [ ] Predictions fetch and display
- [ ] Navigation buttons work
- [ ] Mobile view is responsive
- [ ] Loading states display
- [ ] Error states display

## API Response Examples

### Quick Test (GET /api/test/quick/)
```json
{
  "attempted": false,
  "questions": [
    {
      "id": 1,
      "type": "general",
      "question_text": "What is the capital of France?",
      "options": {
        "A": "London",
        "B": "Paris",
        "C": "Berlin",
        "D": "Madrid"
      }
    }
  ]
}
```

### Skill Test (GET /api/test/skill/)
```json
{
  "skill": "python",
  "total_questions": 15,
  "questions": [
    {
      "id": 10,
      "question": "What is the output of print(2 ** 3)?",
      "options": {
        "A": "5",
        "B": "6",
        "C": "8",
        "D": "9"
      }
    }
  ]
}
```

### Submit Skill Test (POST /api/test/test/skill/submit/)
```json
{
  "score": 12,
  "total": 15,
  "level": "advanced",
  "message": "You are advanced in python"
}
```

### Predictions (GET /api/predict/)
```json
{
  "ability": "Strong problem-solving skills",
  "interest": {"tech": 3, "creative": 1},
  "skills": ["Python", "JavaScript"],
  "top_careers": [
    {
      "title": "Software Engineer",
      "description": "Develop software applications"
    }
  ]
}
```

---

**Last Updated**: April 3, 2026
**Version**: 1.0.0
**Status**: Production Ready

# GoTogether Points & Rewards System 🎯

## Overview
A gamification system that rewards users for connecting and completing activities together.

## How to Earn Points

### 1. **Connection Accepted** → 10 Points
- When someone accepts your connection/join request
- Both users (requester + activity creator) earn points

### 2. **Activity Completed** → 50 Points
- Upload photo/video proof of completed activity
- All participants earn points

### 3. **Activity Created** → 5 Points *(Coming Soon)*
- Small bonus for posting activities

## Levels & Progression

| Level | Points Required |
|-------|----------------|
| 1     | 0              |
| 2     | 100            |
| 3     | 250            |
| 4     | 500            |
| 5     | 1,000          |
| 6     | 2,000          |
| 7     | 3,500          |
| 8     | 5,000          |
| 9     | 7,500          |
| 10    | 10,000         |

## Discount Tiers

| Tier Name    | Min Points | Discount |
|--------------|------------|----------|
| Newcomer     | 0          | 0%       |
| Explorer     | 100        | 5%       |
| Adventurer   | 250        | 10%      |
| Voyager      | 500        | 15%      |
| Pathfinder   | 1,000      | 20%      |
| Trailblazer  | 2,000      | 25%      |
| Pioneer      | 3,500      | 30%      |
| Legend       | 5,000      | 35%      |

## User Flow

### Earning Points (Simple 3-Step Process):

1. **Connect**
   - Click on activity pin
   - Click "Connect & Chat" or "Join Activity"
   - Wait for acceptance → **+10 points each**

2. **Meet & Complete Activity**
   - Go to the activity together
   - Take a photo or video

3. **Upload Proof**
   - Activity creator clicks on their pin
   - Clicks "Complete Activity & Earn Points"
   - Uploads photo/video → **+50 points each**

### Viewing Progress:

- **Top-left card** shows:
  - Current points
  - Current level
  - Completed activities count
  - Discount tier & percentage

## Technical Implementation

### Backend
- **Models**: `User` (points, level), `ActivityCompletion` (proof media)
- **Routes**: `/api/points/accept-request`, `/api/points/complete-activity`, `/api/points/my-stats`
- **Utils**: Points calculation, level progression, discount tiers

### Frontend
- **Components**: `PointsDisplay`, `CompleteActivityModal`
- **Integration**: Dashboard, Chat page, Activity Pin Modal
- **UI**: Elegant wooden theme with golden accents

## Benefits

1. **Engagement**: Users motivated to complete activities
2. **Verification**: Photo/video proof ensures real connections
3. **Rewards**: Progressive discounts encourage continued use
4. **Simplicity**: No clutter, clean 3-step flow
5. **Trust**: Visual proof builds community trust

## Future Enhancements

- Partner discounts at local businesses
- Referral bonuses
- Monthly challenges
- Achievement badges
- Points marketplace



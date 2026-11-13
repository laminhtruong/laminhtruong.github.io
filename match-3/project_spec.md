# Match-3 Game Project Specification

## Project Overview
A Unity-based Match-3 puzzle game implementing classic tile-matching mechanics with a modern architecture using state machines, object pooling, and async operations.

**Engine:** Unity 2022.3.62f2
**Product Name:** match-3
**Platform:** Cross-platform (configurable for mobile/desktop)

---

## Core Architecture

### 1. Game Structure
The project follows a modular architecture with clear separation of concerns:

```
Assets/MainGame/Scripts/
├── Game.Core/          # Core framework utilities
├── Game.Defines/       # Enums, constants, and definitions
├── Game.Model/         # Data models and converters
├── Game.Runtime/       # Game logic and runtime components
└── Editor/             # Unity editor extensions
```

### 2. Namespaces
- `Game.Core` - Framework utilities (StateMachine, Factory, Singleton, EventManager)
- `Game.Defines` - Type definitions and enums
- `Game.Runtime` - Core gameplay systems
- `Game.Model` - Data structures

---

## Technical Stack

### Dependencies (Packages)
- **UniTask** (Cysharp.UniTask) - Async/await for Unity via GitHub integration
- **DOTween** (Demigiant) - Animation and tweening library
- **Unity Addressables** (v1.22.3) - Asset management and loading
- **Newtonsoft JSON** (v3.2.2) - JSON serialization

### Key Technologies
- **Async Programming:** UniTask for non-blocking operations
- **Animation:** DOTween for tile movements and effects
- **Object Pooling:** Custom pooling system via ControllerSpawner
- **State Machine Pattern:** Generic state machine for board states
- **Factory Pattern:** Type-based factory with attribute registration
- **Addressables:** Dynamic resource loading

---

## Core Gameplay Systems

### 1. Board System
**File:** `Board.cs`

The central game board managing an 8x8 grid of cells.

**Key Features:**
- Grid dimensions: 8x8 cells (configurable)
- Cell and tile management
- World-space positioning conversion
- Static obstacles support (walls)

**Services:**
- `BoardServiceInput` - Player input and swipe detection
- `BoardServiceMatch` - Match detection algorithms
- `BoardServiceFill` - Tile dropping and spawning logic

**State Machine:**
```
BoardStateType
├── Idle        - Waiting for player input
├── Swap        - Swapping two tiles
├── SwapBack    - Reverting invalid swap
├── Match       - Detecting matches
└── Explode     - Removing matched tiles
```

### 2. Cell System
**Files:** `Cell.cs`, `CellNormal.cs`, `CellWall.cs`

**Cell Types:**
- `CellNormal` - Standard playable cell
- `CellWall` - Obstacle cell (non-playable)

**Cell Properties:**
- Position (Vector2Int)
- Tile reference
- Type identifier
- Match validation

**Behavior:**
- Tile placement/removal
- Match compatibility checking
- Obstacle detection

### 3. Tile System
**Files:** `Tile.cs`, `TileNormal.cs`

**Tile Types:**
```csharp
enum TileType {
    Normal
}
```

**Tile Styles:**
```csharp
enum TileStyle {
    Style1,  // Red
    Style2,  // Green
    Style3   // Blue
}
```

**Features:**
- Visual style with color mapping
- Idle/Busy state tracking
- Async movement with DOTween paths
- Explosion animations
- Debug text display

### 4. Match Detection System
**Base:** `MatchDetector.cs`

**Match Types:**
```csharp
enum MatchType {
    Horizontal,   // 3+ in a row
    Vertical,     // 3+ in a column
    Square,       // 2x2 formation
    LShape,       // L-shaped pattern
    TShape        // T-shaped pattern
}
```

**Detectors:**
- `MatchDetectorHorizontal` - Row-based matches
- `MatchDetectorVertical` - Column-based matches
- `MatchDetectorSquare` - 2x2 square patterns
- `MatchDetectorLShape` - L-shaped combinations
- `MatchDetectorTShape` - T-shaped combinations

**Algorithm:**
1. Scan board for each match type (priority order)
2. Filter duplicate/overlapping matches
3. Prioritize complex matches (T/L > Square > Line)
4. Return unique match list

### 5. Input System
**File:** `BoardServiceInput.cs`

**Input Method:** Mouse/touch swipe detection

**Flow:**
1. Mouse down - Record start position and selected cell
2. Mouse drag - Track swipe direction
3. Detect swipe threshold (0.5 units)
4. Determine primary direction (horizontal/vertical)
5. Fire OnSwap event with source and target cells
6. Mouse up - Reset selection

**Features:**
- Raycast-based cell selection
- Directional swipe detection (up/down/left/right)
- Validation of target positions

### 6. Fill System
**File:** `BoardServiceFill.cs`

**Responsibilities:**
1. **Drop Tiles**
   - Gravity simulation
   - Find empty cells from bottom-up
   - Calculate drop paths considering obstacles
   - Animate tiles falling with delays per column
   - Use pathfinding for complex drops

2. **Spawn New Tiles**
   - Refill empty spaces
   - Spawn tiles above the board
   - Drop into empty positions
   - Random style assignment
   - Parallel spawning per column

**Async Operations:**
- UniTask for non-blocking drops
- Parallel animation with `UniTask.WhenAll`
- Delay-based column staggering

---

## Game Flow (State Machine)

### State Transitions
```
[Idle]
  ↓ (Player swipes)
[Swap]
  ↓ (Tiles swapped)
[Match]
  ├─ (No matches) → [SwapBack] → [Idle]
  └─ (Matches found) → [Explode]
       ↓ (Tiles removed)
     [Idle]
       ↓ (Auto-trigger)
     [Fill Service]
       ↓ (Tiles dropped/spawned)
     [Match]
       └─ (Recursive until no matches)
```

### State Details

**BoardStateIdle**
- Listens to BoardServiceInput.OnSwap event
- Validates swap conditions (non-empty, idle tiles)
- Transitions to Swap state

**BoardStateSwap**
- Animates tile swap using DOTween
- Updates cell references
- Transitions to Match state

**BoardStateMatch**
- Executes match detection
- If no matches: SwapBack or Idle
- If matches found: Explode state

**BoardStateExplode**
- Plays explosion animations on matched tiles
- Removes tiles from cells
- Triggers fill service
- Re-checks for new matches (cascade)

**BoardStateSwapBack**
- Reverses invalid swap
- Returns to Idle state

---

## Core Framework

### 1. State Machine (`StateMachine.cs`)
Generic state machine implementation:

```csharp
StateMachine<TStateMachine, TOwner>
```

**Features:**
- State stack management
- State history tracking
- Push/Pop state support
- StateData parameter passing
- Enum-based state identification

**Methods:**
- `SetState()` - Replace current state
- `PushState()` - Stack a new state
- `PopState()` - Return to previous state
- `Update()` - Tick current state
- `IsRoot()` - Check state stack depth

### 2. Factory Pattern (`Factory.cs`)
Attribute-based type registration:

```csharp
Factory<TKeyType, TModel> where TKeyType : Enum
```

**Features:**
- Reflection-based type discovery
- Singleton support per type
- Enum key mapping
- Runtime type instantiation

**Usage:**
```csharp
[Factory(BoardStateType.Idle, true)]
public class BoardStateIdle : State<BoardStateMachine>
```

### 3. Object Pooling (`ControllerSpawner.cs`)
Centralized object pool manager:

**Features:**
- Addressables integration
- Synchronous/async spawning
- Automatic return to pool
- Parent transform management
- Key-based asset loading

### 4. Resource Management (`AnR.cs`)
Addressable name resolver:

**Features:**
- Folder-based resource loading
- Key generation utilities
- Centralized asset references

---

## Asset Management

### Addressables Structure
```
Assets/AddressableAssetsData/
```

**Key Patterns:**
- `tile_normal` - Normal tile prefab
- `cell_normal` - Standard cell prefab
- `cell_wall` - Wall obstacle prefab

### Resource Loading
**AnR (Addressable Name Resolver):**
```csharp
AnR.LoadResourceByFolder<GameObject>("Common");
```

---

## Game Initialization

**File:** `GameManager.cs`

**Start Flow:**
1. Load common resources from Addressables
2. Initialize 8x8 board
3. Setup cells with initial tiles
4. Create board services (Input, Match, Fill)
5. Initialize state machine to Idle state
6. Begin game loop

**Obstacle Generation:**
- Row 3 (y=3): All columns except x=1 and x=6 are walls
- Creates challenging board layouts

---

## Editor Tools

### 1. Addressable Generator
Auto-generates addressable entries for assets

### 2. Build Processor
Custom build pipeline integration

---

## Code Conventions

### Naming Conventions
- **Public Fields:** PascalCase
- **Private Fields:** _camelCase with underscore prefix
- **Methods:** PascalCase
- **Namespaces:** Game.* (e.g., Game.Runtime, Game.Core)

### Architecture Patterns
- **Service Layer:** BoardService base class for board operations
- **State Pattern:** All states inherit from `State<TStateMachine>`
- **Factory Registration:** `[Factory(EnumKey, isSingleton)]` attribute
- **Async/Await:** UniTask for all async operations
- **Extension Methods:** Static utility classes (ExtensionTile, ExtensionVector)

### File Organization
- One class per file
- File name matches class name
- Folder structure mirrors namespace structure

---

## Technical Details

### Coordinate System
- **Grid Origin:** Top-left (0, 0)
- **Y-Axis:** Increases downward
- **X-Axis:** Increases rightward
- **World Space:** Centered, with board at world origin

### Animation Timings
- Tile swap: 0.25s (InSine easing)
- Tile explosion: 0.25s (scale to zero)
- Drop delay: Per-column staggering for visual effect

### Physics
- 2D Raycasting for cell selection
- No physics simulation (purely transform-based movement)

---

## Extensibility Points

### Adding New Tile Types
1. Add enum value to `TileType`
2. Create new Tile subclass inheriting from `Tile`
3. Create prefab and add to Addressables with key pattern `tile_{typename}`
4. Update `ControllerTile.Spawn()` if special logic needed

### Adding New Match Patterns
1. Add enum value to `MatchType`
2. Create detector class inheriting from `MatchDetector`
3. Implement pattern logic in `_patterns` property
4. Add `[Factory]` attribute with MatchType key
5. Update `BoardServiceMatch.MatchFilter()` for priority handling

### Adding New Board States
1. Add enum value to `BoardStateType`
2. Create state class inheriting from `State<BoardStateMachine>`
3. Add `[Factory]` attribute with BoardStateType key
4. Implement `Enter()`, `Update()`, `Exit()` methods
5. Define transitions in existing states

---

## Known Implementation Details

### Current Limitations
- Fixed 8x8 board size (configurable but not dynamic)
- Three tile styles (expandable)
- Single tile type (Normal)
- Static obstacle pattern

### Performance Optimizations
- Object pooling for tiles and cells
- Async operations prevent frame blocking
- Parallel match detection
- Efficient pathfinding for tile drops

---

## Future Considerations

### Potential Features
- Power-ups and special tiles
- Multiple game modes
- Level progression system
- Score and combo system
- Sound effects and music integration
- Particle effects for matches
- Tutorial system
- Save/load functionality

### Architecture Improvements
- Configurable board dimensions via editor
- Dynamic obstacle patterns from level data
- Match scoring system
- Event-driven architecture for UI updates
- Dependency injection for services

---

## Development Notes

This project demonstrates:
- Clean architecture with separation of concerns
- Modern C# async patterns in Unity
- Reusable framework components
- Scalable state machine design
- Efficient resource management
- Type-safe factory pattern with reflection

The codebase is structured for easy maintenance and extension, with clear boundaries between systems and well-defined interfaces.

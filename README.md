# 📋 Damage Assessment Viewer - Project Handover Document

## Project Overview

This is a **React-based web application** for viewing and managing damage assessment images. It connects to a **Supabase database** to fetch job data, displays images with damage classifications, and allows users to update image locations in real-time.

---

## 🗂️ File Structure Overview

graph TD
    subgraph "Entry Points"
        A[src/main.tsx]
        B[src/App.tsx]
    end

    subgraph "Pages"
        C[src/pages/Index.tsx]
        D[src/pages/NotFound.tsx]
    end

    subgraph "Core Components"
        E[DamageCard.tsx]
        F[LocationSelector.tsx]
        G[JobLoader.tsx]
        H[DamageScaleBadge.tsx]
    end

    subgraph "Configuration"
        I[src/config/supabase.ts]
    end

    subgraph "Hooks & Data"
        J[useSupabaseConfig.ts]
        K[useSupabaseQuery.ts]
    end

    subgraph "Types"
        L[damage-assessment.ts]
        M[supabase-config.ts]
    end

    A --> B
    B --> C
    C --> E
    C --> G
    E --> F
    E --> H
    C --> J
    C --> K
    J --> I
    K --> L
    K --> M
    I --> M
end

---

## 📁 Detailed File Breakdown

### 🔴 **CRITICAL FILES (Core Application Logic)**

---

#### **1. `src/config/supabase.ts`** - Supabase Configuration

**Purpose:** Hardcoded configuration for connecting to your Supabase database.

**⚠️ ACTION REQUIRED:** Update this file with your actual Supabase credentials.

```typescript
export const SUPABASE_CONFIG: SupabaseConfig = {
  url: 'https://nqoiuxtnwrxowtkrqhla.supabase.co',  // Your Supabase URL
  anonKey: 'eyJhbG...',                              // Your Supabase Anon Key
  tableName: 'image_register_testing',               // Your table name
  columns: {
    jobId: 'job_id',              // Column mapping for job ID
    propertyAddress: 'property_address',
    location: 'location',         // Current location value
    locationsArray: 'locations_array',  // Array of available locations
    numberOf: 'of_how_many',      // "X of Y" progress field
    fileName: 'org_image_name',   // Original image filename
    description: 'description',
    caption: 'caption',
    damageDetected: 'damage_detected',
    damageLabel: 'damage_classification',  // Numeric 0-5 or text label
    imageLocation: 'image_location',  // URL to the image
  },
};
```

**Key Points:**
- All column names must match your Supabase table exactly
- The `locationsArray` column should contain a PostgreSQL array, JSON array, or comma-separated string

---

#### **2. `src/hooks/useSupabaseQuery.ts`** - Database Operations

**Purpose:** Contains all Supabase data fetching and update logic.

**Key Functions:**

| Function | Purpose |
|----------|---------|
| `parseDamageScale(value)` | Converts damage values (0-5 or text labels) to standardized `DamageScaleType` |
| `parseLocationsArray(value)` | Parses location arrays from PostgreSQL array, JSON, or comma-separated formats |
| `fetchJobFromSupabase(jobId, config)` | Fetches all images for a given job ID, maps columns, and sorts results |
| `updateImageLocation(imageId, newLocation, config)` | Persists location changes to Supabase |

**Sorting Logic:**
```typescript
// Images sorted by:
// 1. Number extracted from "X of Y" format (e.g., "1 of 7" → 1)
// 2. Fallback: Natural numeric sorting of filename
images.sort((a, b) => {
  const numA = parseInt(a.numberOf.match(/^(\d+)/)?.[1] || '0', 10);
  const numB = parseInt(b.numberOf.match(/^(\d+)/)?.[1] || '0', 10);
  if (numA !== numB) return numA - numB;
  return a.imageName.localeCompare(b.imageName, undefined, { numeric: true });
});
```

---

#### **3. `src/pages/Index.tsx`** - Main Application Page

**Purpose:** The primary UI component that orchestrates the entire application.

**State Management:**
- `currentJob` - The currently loaded job object
- `images` - Array of damage images for the current job
- `isLoading` - Loading state for UI feedback

**Key Functions:**

| Function | Purpose |
|----------|---------|
| `handleLoadJob(jobId)` | Fetches job data from Supabase, updates state, shows toast notifications |
| `handleLocationChange(imageId, newLocation)` | Updates local state and persists to Supabase |

**Component Structure:**
```
Index
├── Header (sticky with app title)
├── JobLoader (input + load button)
├── Status display (job name, image count, config warning)
└── Content Area
    ├── Empty State (when no job loaded)
    └── Image Grid (DamageCard components in 2-column layout)
```

---

#### **4. `src/components/DamageCard.tsx`** - Image Display Card

**Purpose:** Displays individual damage assessment images with all metadata.

**Features:**
- Location dropdown selector
- Image with lazy loading and loading skeleton
- Click-to-expand modal for full-size image viewing
- Damage scale badge with color coding
- Metadata display (filename, description, caption, damage detected)

**Props:**
```typescript
interface DamageCardProps {
  image: DamageImage;
  onLocationChange: (imageId: string, newLocation: string) => void;
}
```

---

#### **5. `src/components/LocationSelector.tsx`** - Location Dropdown

**Purpose:** Dropdown for selecting/changing image location with custom "Other" option.

**Modes:**
1. **Normal Mode:** Standard dropdown with locations from `locationsArray`
2. **Custom Mode:** Text input for entering custom location values

**Key Features:**
- Automatically includes current location in dropdown even if not in `locationsArray`
- "Other..." option triggers custom input mode
- Enter key saves, Escape key cancels in custom mode
- Saves directly to Supabase on selection

---

#### **6. `src/types/damage-assessment.ts`** - Type Definitions

**Purpose:** Core TypeScript interfaces and constants for damage assessment data.

**Key Types:**
```typescript
interface DamageImage {
  id: string;
  location: string;
  locationsArray: string[];
  numberOf: string;
  imageName: string;
  imageUrl: string;
  description: string;
  caption: string;
  damageDetected: string;
  damageScale: DamageScaleType;
}

type DamageScaleType = 'None' | 'Minor' | 'Moderate' | 'Serious' | 'Severe' | 'Critical';
```

**Damage Scale Mapping:**
| Value | Label | Color |
|-------|-------|-------|
| 0 | None | Emerald (green) |
| 1 | Minor | Lime (light green) |
| 2 | Moderate | Yellow |
| 3 | Serious | Orange |
| 4 | Severe | Red |
| 5 | Critical | Dark Red |

---

### 🟡 **SUPPORTING FILES**

---

#### **`src/hooks/useSupabaseConfig.ts`**
Simple hook that returns the hardcoded config and validates it's properly configured (checks URL format and key length).

#### **`src/components/DamageScaleBadge.tsx`**
Renders a colored pill/badge showing the damage severity level using the color mapping from `damage-assessment.ts`.

#### **`src/components/JobLoader.tsx`**
Simple form component with text input and "Load" button. Calls parent's `onLoad` function with the entered job ID.

#### **`src/types/supabase-config.ts`**
TypeScript interface defining the shape of `SupabaseConfig` including all column mappings.

---

### 🟢 **FRAMEWORK/BOILERPLATE FILES**

| File | Purpose |
|------|---------|
| `src/main.tsx` | React app entry point, renders `` |
| `src/App.tsx` | Root component with providers (React Query, Tooltips, Toasts, Router) |
| `src/pages/NotFound.tsx` | 404 page |
| `src/index.css` | Global styles and Tailwind imports |
| `src/lib/utils.ts` | Utility functions (cn for className merging) |
| `src/components/ui/*` | shadcn/ui component library (pre-built UI components) |

---

## 🗄️ Required Supabase Table Schema

Your Supabase table needs these columns (names configurable in `supabase.ts`):

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid/int | Primary key (used for updates) |
| `job_id` | text | Job identifier for querying |
| `property_address` | text | Property address (optional) |
| `location` | text | Current assigned location |
| `locations_array` | text[]/jsonb | Available location options |
| `of_how_many` | text | Progress indicator (e.g., "1 of 7") |
| `org_image_name` | text | Original filename |
| `description` | text | Image description |
| `caption` | text | Image caption |
| `damage_detected` | text | Damage description text |
| `damage_classification` | int/text | Damage scale (0-5 or label) |
| `image_location` | text | URL to the image file |

---

## 🔄 Data Flow Diagram

sequenceDiagram
    participant User
    participant Index
    participant JobLoader
    participant useSupabaseQuery
    participant Supabase
    participant DamageCard
    participant LocationSelector

    User->>JobLoader: Enter Job ID & Click Load
    JobLoader->>Index: onLoad(jobId)
    Index->>useSupabaseQuery: fetchJobFromSupabase(jobId, config)
    useSupabaseQuery->>Supabase: SELECT * WHERE job_id = jobId
    Supabase-->>useSupabaseQuery: Raw data rows
    useSupabaseQuery->>useSupabaseQuery: Parse & map columns
    useSupabaseQuery->>useSupabaseQuery: Sort by numberOf/filename
    useSupabaseQuery-->>Index: DamageImage[]
    Index->>DamageCard: Render cards with images

    User->>LocationSelector: Select new location
    LocationSelector->>Index: onLocationChange(id, location)
    Index->>Index: Update local state
    Index->>useSupabaseQuery: updateImageLocation(id, location)
    useSupabaseQuery->>Supabase: UPDATE SET location = newLocation

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Supabase JS | Database client |
| React Query | Data fetching (available but not heavily used) |
| React Router | Routing |
| Sonner/Toast | Notifications |

---

## ✅ Quick Start Checklist

1. ☐ Update `src/config/supabase.ts` with your Supabase URL
2. ☐ Update `src/config/supabase.ts` with your Supabase Anon Key
3. ☐ Update table name if different from `image_register_testing`
4. ☐ Verify column mappings match your actual database columns
5. ☐ Ensure `locations_array` column is populated in your database
6. ☐ Test by entering a valid Job ID and clicking "Load"

---

This document should provide everything needed to understand, maintain, and extend this project. Let me know if you need any specific section expanded or clarified!

Export as Document
Add Code Documentation
Create README.md

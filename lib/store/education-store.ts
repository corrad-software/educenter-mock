import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EducationLevel, PortalRole } from '../types';

interface EducationStore {
  selectedLevel: EducationLevel | null;
  portalRole: PortalRole | null;
  selectLevel: (level: EducationLevel, role: PortalRole) => void;
  clearSelection: () => void;
}

export const useEducationStore = create<EducationStore>()(
  persist(
    (set) => ({
      selectedLevel: null,
      portalRole: null,
      selectLevel: (level, role) => set({ selectedLevel: level, portalRole: role }),
      clearSelection: () => set({ selectedLevel: null, portalRole: null }),
    }),
    {
      name: 'educentre-level',
    }
  )
);

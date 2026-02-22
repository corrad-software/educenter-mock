import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockStudents } from '@/lib/mock-data';
import type { User } from '@/lib/types';

export type MobileRole = 'parent' | 'teacher';

interface ParentMobileStore {
  isLoggedIn: boolean;
  guardian: User | null;
  selectedChildId: string;
  activeRole: MobileRole;
  _hasHydrated: boolean;
  login: (ic: string, phone: string) => boolean;
  logout: () => void;
  selectChild: (id: string) => void;
  switchRole: (role: MobileRole) => void;
  setHasHydrated: (v: boolean) => void;
}

// Guardian g1's children
const GUARDIAN_ID = 'g1';
const guardianChildren = mockStudents.filter(s => s.guardianId === GUARDIAN_ID);
const defaultChildId = guardianChildren[0]?.id ?? '1';

export const useParentMobileStore = create<ParentMobileStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      guardian: null,
      selectedChildId: defaultChildId,
      activeRole: 'parent',
      _hasHydrated: false,

      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),

      login: (ic: string, phone: string) => {
        // Mock auth: accept guardian g1 credentials
        if (ic === '800505-10-5678' && phone === '+60123456789') {
          const guardian = guardianChildren[0]?.guardian ?? null;
          set({ isLoggedIn: true, guardian, selectedChildId: defaultChildId });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isLoggedIn: false, guardian: null, selectedChildId: defaultChildId, activeRole: 'parent' });
      },

      switchRole: (role: MobileRole) => {
        set({ activeRole: role });
      },

      selectChild: (id: string) => {
        set({ selectedChildId: id });
      },
    }),
    {
      name: 'educentre-parent-mobile',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export { GUARDIAN_ID, guardianChildren };

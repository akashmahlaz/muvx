"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type FleetSize = "1-5" | "6-20" | "21-50" | "51-100" | "100+"
export type PrimaryUse =
  | "long_haul"
  | "ltl"
  | "local"
  | "owner_operator"
  | "brokerage"
  | "other"

type OnboardingData = {
  // Step 1: Company basics
  companyName: string
  slug: string
  // Step 2: Industry details
  dotNumber: string
  mcNumber: string
  // Step 3: Personalization
  fleetSize: FleetSize | ""
  primaryUse: PrimaryUse | ""

  // UI state
  currentStep: number
  completedSteps: number[]
}

type OnboardingState = OnboardingData & {
  setField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void
  isStepValid: (step: number) => boolean
}

const initialData: OnboardingData = {
  companyName: "",
  slug: "",
  dotNumber: "",
  mcNumber: "",
  fleetSize: "",
  primaryUse: "",
  currentStep: 0,
  completedSteps: [],
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialData,

      setField: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),

      nextStep: () =>
        set((state) => {
          const newStep = Math.min(state.currentStep + 1, 3)
          const completed = new Set(state.completedSteps)
          completed.add(state.currentStep)
          return {
            currentStep: newStep,
            completedSteps: Array.from(completed).sort((a, b) => a - b),
          }
        }),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      goToStep: (step) =>
        set((state) => {
          // Only allow going to a step if all previous steps are completed
          const canAccess =
            step === 0 ||
            state.completedSteps.includes(step - 1) ||
            step <= state.currentStep
          if (!canAccess) return state
          return { currentStep: step }
        }),

      reset: () => set(initialData),

      isStepValid: (step) => {
        const state = get()
        switch (step) {
          case 0:
            return state.companyName.trim().length >= 2 && state.slug.trim().length >= 2
          case 1:
            // DOT/MC are optional, always valid
            return true
          case 2:
            // Fleet size + use case are optional
            return true
          default:
            return false
        }
      },
    }),
    {
      name: "muvx-onboarding",
      partialize: (state) => ({
        companyName: state.companyName,
        slug: state.slug,
        dotNumber: state.dotNumber,
        mcNumber: state.mcNumber,
        fleetSize: state.fleetSize,
        primaryUse: state.primaryUse,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    }
  )
)

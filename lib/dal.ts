import "server-only"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { eq, and, desc, sql } from "drizzle-orm"
import { headers } from "next/headers"
import {
  load,
  trip,
  driver,
  truck,
  trailer,
  invoice,
  payStub,
  apExpense,
  carrierPayment,
  organization,
  member,
} from "@/lib/schema"
import { cache } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// AUTH CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

export const getSession = cache(async () => {
  const headersList = await headers()
  return auth.api.getSession({ headers: headersList })
})

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  return session?.user ?? null
})

export const getActiveOrganizationId = cache(async (): Promise<string | null> => {
  const session = await getSession()
  return session?.session?.activeOrganizationId ?? null
})

/**
 * Ensures we have a valid user and active organization.
 * Use this in any Server Action or Route Handler that touches tenant data.
 */
export async function requireTenant() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error("UNAUTHORIZED")
  }
  const orgId = session.session.activeOrganizationId
  if (!orgId) {
    throw new Error("NO_ACTIVE_ORGANIZATION")
  }
  return {
    userId: session.user.id,
    userRole: (session.user as any).role ?? null,
    tenantId: orgId,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADS
// ─────────────────────────────────────────────────────────────────────────────

export const getLoadsForOrg = async (tenantId: string) => {
  return db
    .select()
    .from(load)
    .where(eq(load.tenantId, tenantId))
    .orderBy(desc(load.createdAt))
}

export const getLoadById = async (loadId: string, tenantId: string) => {
  const [result] = await db
    .select()
    .from(load)
    .where(and(eq(load.id, loadId), eq(load.tenantId, tenantId)))
    .limit(1)
  return result ?? null
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIPS
// ─────────────────────────────────────────────────────────────────────────────

export const getTripsForOrg = async (tenantId: string) => {
  return db
    .select()
    .from(trip)
    .where(eq(trip.tenantId, tenantId))
    .orderBy(desc(trip.createdAt))
}

// ─────────────────────────────────────────────────────────────────────────────
// DRIVERS
// ─────────────────────────────────────────────────────────────────────────────

export const getDriversForOrg = async (tenantId: string) => {
  return db
    .select()
    .from(driver)
    .where(eq(driver.tenantId, tenantId))
    .orderBy(desc(driver.createdAt))
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUCKS
// ─────────────────────────────────────────────────────────────────────────────

export const getTrucksForOrg = async (tenantId: string) => {
  return db
    .select()
    .from(truck)
    .where(eq(truck.tenantId, tenantId))
    .orderBy(desc(truck.createdAt))
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAILERS
// ─────────────────────────────────────────────────────────────────────────────

export const getTrailersForOrg = async (tenantId: string) => {
  return db
    .select()
    .from(trailer)
    .where(eq(trailer.tenantId, tenantId))
    .orderBy(desc(trailer.createdAt))
}

// ─────────────────────────────────────────────────────────────────────────────
// INVOICES
// ─────────────────────────────────────────────────────────────────────────────

export const getInvoicesForOrg = async (tenantId: string) => {
  return db
    .select()
    .from(invoice)
    .where(eq(invoice.tenantId, tenantId))
    .orderBy(desc(invoice.createdAt))
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYROLL
// ─────────────────────────────────────────────────────────────────────────────

export const getPayStubsForOrg = async (tenantId: string) => {
  return db
    .select()
    .from(payStub)
    .where(eq(payStub.tenantId, tenantId))
    .orderBy(desc(payStub.createdAt))
}

// ─────────────────────────────────────────────────────────────────────────────
// AP EXPENSES
// ─────────────────────────────────────────────────────────────────────────────

export const getApExpensesForOrg = async (tenantId: string) => {
  return db
    .select()
    .from(apExpense)
    .where(eq(apExpense.tenantId, tenantId))
    .orderBy(desc(apExpense.createdAt))
}

// ─────────────────────────────────────────────────────────────────────────────
// CARRIER PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const getCarrierPaymentsForOrg = async (tenantId: string) => {
  return db
    .select()
    .from(carrierPayment)
    .where(eq(carrierPayment.tenantId, tenantId))
    .orderBy(desc(carrierPayment.createdAt))
}

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIZATION
// ─────────────────────────────────────────────────────────────────────────────

export const getOrganizationById = async (orgId: string) => {
  const [result] = await db
    .select()
    .from(organization)
    .where(eq(organization.id, orgId))
    .limit(1)
  return result ?? null
}

export const getMembersForOrg = async (orgId: string) => {
  return db
    .select()
    .from(member)
    .where(eq(member.organizationId, orgId))
}

// ─────────────────────────────────────────────────────────────────────────────
// AGGREGATES / KPIs
// ─────────────────────────────────────────────────────────────────────────────

export const getActiveLoadsCount = async (tenantId: string) => {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(load)
    .where(and(
      eq(load.tenantId, tenantId),
      sql`${load.status} IN ('booked', 'dispatched', 'in_transit')`
    ))
  return Number(result?.count ?? 0)
}

export const getOnTimePercent = async (tenantId: string) => {
  // Delivered loads vs on-time
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(load)
    .where(and(
      eq(load.tenantId, tenantId),
      eq(load.status, "delivered")
    ))
  return Number(result?.count ?? 0)
}

export const getMonthlyRevenue = async (tenantId: string) => {
  const [result] = await db
    .select({ total: sql<string>`coalesce(sum(${invoice.amount}::numeric), 0)` })
    .from(invoice)
    .where(and(
      eq(invoice.tenantId, tenantId),
      sql`${invoice.createdAt} >= date_trunc('month', now())`
    ))
  return Number(result?.total ?? 0)
}

export const getActiveDriversCount = async (tenantId: string) => {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(driver)
    .where(and(
      eq(driver.tenantId, tenantId),
      eq(driver.status, "active")
    ))
  return Number(result?.count ?? 0)
}

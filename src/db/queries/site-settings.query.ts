import { eq } from "drizzle-orm";

import { defaultSiteSettings, type SiteSettings } from "@/lib/site-settings-defaults";
import { db } from "../db";
import { siteSettings } from "../schemas/schema";
import { isRetryableDatabaseError, retryDatabaseRead } from "./retry";

export type SiteSettingsInput = SiteSettings;
export type AdminSiteSettings = SiteSettings & {
  updatedAt?: Date;
};

type SiteSettingsRow = typeof siteSettings.$inferSelect;

const SITE_SETTINGS_ID = 1;

function isMissingSiteSettingsTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const cause = error instanceof Error ? error.cause : undefined;
  const causeMessage = cause instanceof Error ? cause.message : "";

  return `${message} ${causeMessage}`.includes('relation "site_settings" does not exist');
}

async function readSiteSettingsRow() {
  try {
    const [settings] = await retryDatabaseRead(() =>
      db.select().from(siteSettings).where(eq(siteSettings.id, SITE_SETTINGS_ID)).limit(1),
    );

    return settings;
  } catch (error) {
    if (isMissingSiteSettingsTableError(error) || isRetryableDatabaseError(error)) {
      return undefined;
    }

    throw error;
  }
}

function normalizeStringArray(value: string[] | null | undefined, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value.map((item) => item.trim()).filter(Boolean);
  return items.length > 0 ? items : fallback;
}

function mapSiteSettings(row: SiteSettingsRow | undefined): AdminSiteSettings {
  if (!row) {
    return defaultSiteSettings;
  }

  return {
    siteName: row.siteName,
    siteDescription: row.siteDescription,
    siteUrl: row.siteUrl,
    rssUrl: row.rssUrl,
    seoTitleTemplate: row.seoTitleTemplate,
    seoKeywords: normalizeStringArray(row.seoKeywords, defaultSiteSettings.seoKeywords),
    seoDescription: row.seoDescription,
    authorName: row.authorName,
    avatarUrl: row.avatarUrl,
    signatureUrl: row.signatureUrl,
    contactEmail: row.contactEmail,
    githubUrl: row.githubUrl,
    neteaseMusicUrl: row.neteaseMusicUrl,
    douyinUrl: row.douyinUrl,
    wechatQrUrl: row.wechatQrUrl,
    footerDescription: row.footerDescription,
    footerStatusText: row.footerStatusText,
    homeHeroPrefix: row.homeHeroPrefix,
    homeHeroSuffix: row.homeHeroSuffix,
    homeShareText: row.homeShareText,
    homeLocationText: row.homeLocationText,
    homeRotatingTexts: normalizeStringArray(row.homeRotatingTexts, defaultSiteSettings.homeRotatingTexts),
    learningStartedAt: row.learningStartedAt,
    mottoCodeText: row.mottoCodeText,
    mottoCnPrefix: row.mottoCnPrefix,
    mottoCnHighlightA: row.mottoCnHighlightA,
    mottoCnMiddle: row.mottoCnMiddle,
    mottoCnHighlightB: row.mottoCnHighlightB,
    mottoCnSuffix: row.mottoCnSuffix,
    mottoEnText: row.mottoEnText,
    friendPageTitle: row.friendPageTitle,
    friendPageDescription: row.friendPageDescription,
    friendApplyEnabled: row.friendApplyEnabled,
    friendApplyIntro: row.friendApplyIntro,
    friendApplyNotes: normalizeStringArray(row.friendApplyNotes, defaultSiteSettings.friendApplyNotes),
    friendOwnName: row.friendOwnName,
    friendOwnUrl: row.friendOwnUrl,
    friendOwnAvatarUrl: row.friendOwnAvatarUrl,
    friendOwnDescription: row.friendOwnDescription,
    friendApplySuccessMessage: row.friendApplySuccessMessage,
    adminPageSize: row.adminPageSize,
    adminDefaultEntry: row.adminDefaultEntry,
    updatedAt: row.updatedAt,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await readSiteSettingsRow();

  return mapSiteSettings(settings);
}

export async function getAdminSiteSettings(): Promise<AdminSiteSettings> {
  const settings = await readSiteSettingsRow();

  return mapSiteSettings(settings);
}

export async function updateSiteSettings(input: SiteSettingsInput) {
  const [settings] = await db
    .insert(siteSettings)
    .values({
      id: SITE_SETTINGS_ID,
      ...input,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        ...input,
        updatedAt: new Date(),
      },
    })
    .returning({ id: siteSettings.id });

  return settings;
}

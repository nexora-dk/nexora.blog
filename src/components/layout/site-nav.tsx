"use client";

import { type CSSProperties, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HomePanel } from "@/components/layout/navigation/home-panel";
import { MorePanel } from "@/components/layout/navigation/more-panel";
import { NotesPanel } from "@/components/layout/navigation/notes-panel";
import { TimelinePanel } from "@/components/layout/navigation/timeline-panel";
import { WritingPanel } from "@/components/layout/navigation/writing-panel";
import homePanelStyles from "@/styles/page/home-panel.module.css";
import morePanelStyles from "@/styles/page/more-panel.module.css";
import notesPanelStyles from "@/styles/page/notes-panel.module.css";
import timelinePanelStyles from "@/styles/page/timeline-panel.module.css";
import writingPanelStyles from "@/styles/page/writing-panel.module.css";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { siteConfig } from "@/lib/site";
import styles from "@/styles/page/navigation.module.css";

type PanelType = "home" | "writing" | "notes" | "timeline" | "more";

function getPanelClassName(type: PanelType) {
  if (type === "home") {
    return homePanelStyles.panelShell;
  }

  if (type === "writing") {
    return writingPanelStyles.panelShell;
  }

  if (type === "notes") {
    return notesPanelStyles.panelShell;
  }

  if (type === "timeline") {
    return timelinePanelStyles.panelShell;
  }

  if (type === "more") {
    return morePanelStyles.panelShell;
  }

  return styles.defaultPanelShell;
}

function renderPanel(type: PanelType, href?: string, title?: string) {
  if (type === "home") {
    return <HomePanel />;
  }

  if (type === "writing") {
    return <WritingPanel />;
  }

  if (type === "notes") {
    return <NotesPanel />;
  }

  if (type === "timeline") {
    return <TimelinePanel />;
  }

  if (type === "more") {
    return <MorePanel />;
  }

  if (href && title) {
    return (
      <Link href={href} className={styles.panelLinkPlain}>
        <span className={styles.panelLinkTitle}>查看{title}</span>
      </Link>
    );
  }

  return null;
}

export function SiteNav() {
  const router = useRouter();
  const [viewportX, setViewportX] = useState("50%");
  const [openPanel, setOpenPanel] = useState("");
  const navStyle = { "--navigation-menu-viewport-x": viewportX } as CSSProperties;

  function closePanel() {
    setOpenPanel("");
  }

  function updateViewportX(element: HTMLElement) {
    const navRect = element.closest("nav")?.getBoundingClientRect();
    const triggerRect = element.getBoundingClientRect();

    if (!navRect) {
      return;
    }

    setViewportX(`${triggerRect.left + triggerRect.width / 2 - navRect.left}px`);
  }

  return (
    <NavigationMenu value={openPanel} onValueChange={setOpenPanel} className={styles.nav} viewportClassName={styles.viewport} style={navStyle}>
      <NavigationMenuList className={styles.list}>
        {siteConfig.nav.map((item) => (
          <NavigationMenuItem key={item.title} className={styles.item}>
            {"panel" in item ? (
              <>
                <NavigationMenuTrigger className={styles.link} onClick={() => "href" in item && router.push(item.href)} onPointerEnter={(event) => updateViewportX(event.currentTarget)} onFocus={(event) => updateViewportX(event.currentTarget)}>
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className={getPanelClassName(item.panel.type)} onClick={closePanel}>{renderPanel(item.panel.type, "href" in item ? item.href : undefined, item.title)}</NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link href={item.href} className={styles.link}>
                  {item.title}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

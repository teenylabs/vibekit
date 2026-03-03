// VibeKit Design Companion — Core Types

export interface ScreenSpec {
  appName: string;
  skin: string;
  screens: Screen[];
  navigation: {
    type: "sidebar" | "top";
    items: NavItem[];
  };
  interactions: {
    transitions: Record<string, string>;
  };
}

export interface Screen {
  id: string;
  name: string;
  path?: string;
  layout?: "sidebar" | "full" | "none";
  type?: "page" | "dialog" | "sheet";
  description: string;
  openedVia?: { type: string; from: string };
  sections: Section[];
  emptyState?: {
    icon: string;
    title: string;
    description: string;
    action?: { label: string; navigateTo: string };
  };
}

export interface Section {
  id: string;
  component: string;
  props: Record<string, any>;
}

export interface NavItem {
  label: string;
  icon: string;
  screen: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface CompanionState {
  selectedSkin: "modern-saas" | "warm-friendly" | "dark-technical" | "custom";
  messages: ChatMessage[];
  isLoading: boolean;
  screenSpec: ScreenSpec | null;
  activeScreenId: string | null;
  previewDevice: "desktop" | "tablet" | "phone";
  openOverlays: string[];
}

export type CompanionAction =
  | { type: "SET_SKIN"; skin: CompanionState["selectedSkin"] }
  | { type: "ADD_MESSAGE"; message: ChatMessage }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_SCREEN_SPEC"; spec: ScreenSpec }
  | { type: "SET_ACTIVE_SCREEN"; screenId: string }
  | { type: "SET_PREVIEW_DEVICE"; device: CompanionState["previewDevice"] }
  | { type: "OPEN_OVERLAY"; screenId: string }
  | { type: "CLOSE_OVERLAY"; screenId: string }
  | { type: "CLOSE_ALL_OVERLAYS" };

export type AppFeatureIcon = "gauge" | "copy" | "chart-bar" | "folders";

export interface DesktopApp {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  features: { icon: AppFeatureIcon; title: string; desc: string }[];
  screenshots: { src: string; alt: string }[];
  privacyHref: string;
  android: { downloadHref: string; fileSizeLabel: string; playStoreHref: string | null };
  windows: { downloadHref: string; fileSizeLabel: string };
}

export const APPS: DesktopApp[] = [
  {
    slug: "device-cleaner",
    name: "Device Cleaner",
    tagline: "Find duplicate files, big files, and organize folders. No ads, no tracking.",
    description:
      "Device Cleaner helps you see what's actually using space on your device and clean it up on your terms — nothing happens automatically, and nothing leaves your device.",
    icon: "/apps/device-cleaner/icon.svg",
    features: [
      { icon: "gauge",     title: "Dashboard", desc: "Real battery level, storage used/free, and the app's own cache size." },
      { icon: "copy",      title: "Duplicate Finder", desc: "Scans a folder you pick for files with identical content, so you can delete the extras." },
      { icon: "chart-bar", title: "Large File Finder", desc: "Finds the biggest files in a folder you pick, so you can see what's actually worth deleting." },
      { icon: "folders",   title: "Folder Organizer", desc: "Sorts loose files in a folder you pick into subfolders by type — Images, Documents, Videos, Audio, Archives, Other." },
    ],
    screenshots: [
      { src: "/apps/device-cleaner/screenshots/dashboard.png", alt: "Device Cleaner dashboard showing battery and storage" },
      { src: "/apps/device-cleaner/screenshots/duplicates.png", alt: "Device Cleaner duplicate file finder results" },
      { src: "/apps/device-cleaner/screenshots/largefiles.png", alt: "Device Cleaner large file finder results" },
      { src: "/apps/device-cleaner/screenshots/organizer.png", alt: "Device Cleaner folder organizer plan" },
    ],
    privacyHref: "/apps/device-cleaner/privacy",
    android: {
      downloadHref: "/downloads/DeviceCleaner.apk",
      fileSizeLabel: "5.0 MB",
      playStoreHref: null, // not yet published — swap in the Play Store URL once it's live
    },
    windows: {
      downloadHref: "/downloads/DeviceCleanerPro.exe",
      fileSizeLabel: "12.9 MB",
    },
  },
];

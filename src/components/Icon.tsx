import type { CSSProperties } from 'react';

export type IconName =
  | 'home' | 'grid' | 'message' | 'bolt' | 'checkSquare' | 'clock' | 'alert'
  | 'check' | 'arrowRight' | 'file' | 'chevronRight' | 'upload' | 'image'
  | 'folders' | 'plus' | 'info' | 'search' | 'triangle' | 'activity' | 'send'
  | 'xCircle' | 'table' | 'spinner' | 'signature' | 'clipboard' | 'building'
  | 'users' | 'chart' | 'x' | 'settings' | 'mail' | 'car' | 'scale' | 'eye'
  | 'pause' | 'play' | 'trash' | 'more'
  | 'bold' | 'italic' | 'underline' | 'alignLeft' | 'alignCenter' | 'alignRight'
  | 'alignJustify' | 'listOrdered' | 'listBullet' | 'bell' | 'note';

const paths: Record<IconName, React.ReactNode> = {
  home: <path d="M3 12l9-9 9 9M5 10v10h14V10" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9z" />,
  checkSquare: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>,
  chevronRight: <path d="M9 18l6-6-6-6" />,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5M12 3v12" /></>,
  image: <><path d="M21 8v13H3V8M1 3h22v5H1z" /><path d="M10 12h4" /></>,
  folders: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 12h8M8 8h8M8 16h5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>,
  triangle: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></>,
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />,
  xCircle: <><circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" /></>,
  table: <><path d="M4 4h16v16H4z" /><path d="M4 9h16M9 4v16" /></>,
  spinner: <path d="M12 2a10 10 0 1 0 10 10" />,
  signature: <><path d="M3 17c3 0 3-10 6-10s3 6 6 6 3-2 6-2" /><path d="M3 21h18" /></>,
  clipboard: <><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 12l2 2 4-4" /></>,
  building: <><path d="M3 21h18M6 21V7l6-4 6 4v14" /><path d="M10 9h.01M14 9h.01M10 13h.01M14 13h.01M10 17h.01M14 17h.01" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M7 14l3-3 3 3 5-6" /></>,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 6 10-6" /></>,
  car: <><path d="M5 17H3v-4l2-5h14l2 5v4h-2" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /></>,
  scale: <><path d="M12 3v18M5 21h14M3 7h18M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z" /></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  pause: <><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>,
  play: <path d="M6 4l14 8-14 8z" />,
  trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" /></>,
  more: <><circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" /></>,
  bold: <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />,
  italic: <path d="M19 5h-7M12 19H5M15 5l-4 14" />,
  underline: <><path d="M6 4v6a6 6 0 0 0 12 0V4" /><path d="M5 21h14" /></>,
  alignLeft: <path d="M4 6h16M4 12h11M4 18h14" />,
  alignCenter: <path d="M4 6h16M7 12h10M5 18h14" />,
  alignRight: <path d="M4 6h16M9 12h11M6 18h14" />,
  alignJustify: <path d="M4 6h16M4 12h16M4 18h16" />,
  listOrdered: <><path d="M10 6h11M10 12h11M10 18h11" /><path d="M4 5h1v4M4 9h2" /></>,
  listBullet: <><path d="M9 6h12M9 12h12M9 18h12" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  note: <><path d="M4 4h16v12l-4 4H4z" /><path d="M14 20v-4h4M8 9h8M8 13h5" /></>,
};

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
};

export default function Icon({ name, size, className, style }: Props) {
  const s = size ? { width: size, height: size, ...style } : style;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={s}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

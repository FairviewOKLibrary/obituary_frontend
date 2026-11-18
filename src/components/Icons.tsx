import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };
function Svg({ size = 20, children, ...props }: IconProps) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>{children}</svg>;
}
export const BookIcon = (props: IconProps) => <Svg {...props}><path d="M12 7c-2.8-1.9-5.6-2.4-9-2v13c3.3-.4 6.2.2 9 2 2.8-1.8 5.7-2.4 9-2V5c-3.4-.4-6.2.1-9 2Z"/><path d="M12 7v13"/></Svg>;
export const SearchIcon = (props: IconProps) => <Svg {...props}><circle cx="10.8" cy="10.8" r="6.9"/><path d="m16 16 5 5"/></Svg>;
export const ArrowRightIcon = (props: IconProps) => <Svg {...props}><path d="M4 12h16m-7-7 7 7-7 7"/></Svg>;
export const ArrowLeftIcon = (props: IconProps) => <Svg {...props}><path d="M20 12H4m7 7-7-7 7-7"/></Svg>;
export const CalendarIcon = (props: IconProps) => <Svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></Svg>;
export const ArchiveIcon = (props: IconProps) => <Svg {...props}><rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/></Svg>;
export const HeartIcon = (props: IconProps) => <Svg {...props}><path d="M20.8 8.5C20.8 14 12 20 12 20S3.2 14 3.2 8.5a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z"/></Svg>;
export const ExternalIcon = (props: IconProps) => <Svg {...props}><path d="M13 5h6v6m0-6-9 9"/><path d="M19 14v5H5V5h5"/></Svg>;
export const CloseIcon = (props: IconProps) => <Svg {...props}><path d="m5 5 14 14M19 5 5 19"/></Svg>;
export const InfoIcon = (props: IconProps) => <Svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.4"/></Svg>;
export const ChevronRightIcon = (props: IconProps) => <Svg {...props}><path d="m9 5 7 7-7 7"/></Svg>;
export const FilterIcon = (props: IconProps) => <Svg {...props}><path d="M4 7h16M7 12h10m-7 5h4"/></Svg>;

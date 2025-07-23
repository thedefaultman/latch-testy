import Image from "next/image";

export function Logo(props: { width?: number; height?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={props.width || 40}
      height={props.height || 40}
      className={props.className}
      priority
    />
  );
} 
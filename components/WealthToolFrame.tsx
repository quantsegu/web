interface WealthToolFrameProps {
  src: string;
  title: string;
}

/** Full-viewport iframe host for static wealth-tool HTML pages. */
export default function WealthToolFrame({ src, title }: WealthToolFrameProps) {
  return (
    <iframe
      src={src}
      title={title}
      className="fixed inset-0 w-full h-full border-0 z-40 bg-[#f4f4f2]"
    />
  );
}

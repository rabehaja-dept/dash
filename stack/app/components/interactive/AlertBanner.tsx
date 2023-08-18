type AlertBannerProps = {
  content: React.ReactNode;
};

export function AlertBanner({ content }: AlertBannerProps) {
  return <div className="bg-primary px-10 py-1 text-white">{content}</div>;
}

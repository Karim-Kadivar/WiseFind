import React from 'react';

interface WiseBookmarkIconProps {
  className?: string;
  size?: number | string;
  filled?: boolean;
  active?: boolean;
}

/**
 * Clean, modern 2D flat Bookmark Icon matching the interface design system.
 * Uses crisp vector paths with sharp, clear contrast in both light and dark themes.
 */
export const WiseBookmarkIcon: React.FC<WiseBookmarkIconProps> = ({
  className = '',
  size = 20,
  filled = false,
  active = false
}) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size as string, 10) || 20;
  const isFilled = filled || active;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={isFilled ? '0' : '2'}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block flex-shrink-0 transition-colors ${className}`}
      aria-hidden="true"
    >
      <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
};

export default WiseBookmarkIcon;

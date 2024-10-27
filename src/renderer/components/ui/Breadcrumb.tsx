import React from 'react';

interface BreadcrumbProps {
  path: string[];
  onNavigate: (index: number) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {path.map((segment, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-text-light">/</span>}
          <button
            onClick={() => onNavigate(index)}
            className="hover:text-primary transition-colors text-text-dark"
          >
            {segment || 'Home'}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

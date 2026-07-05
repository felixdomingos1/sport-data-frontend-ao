import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
    <div className="w-16 h-16 bg-[var(--card-bg)] rounded-2xl flex items-center justify-center mb-4 border border-[var(--card-border)]">
      <Construction className="w-8 h-8 text-[#E60000]" />
    </div>
    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h2>
    <p className="text-[var(--text-muted)] text-sm max-w-md">{description}</p>
  </div>
);

export default PlaceholderPage;

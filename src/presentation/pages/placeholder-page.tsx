import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
    <div className="w-16 h-16 bg-[#0f0f0f] rounded-2xl flex items-center justify-center mb-4 border border-[#1a1a1a]">
      <Construction className="w-8 h-8 text-[#E60000]" />
    </div>
    <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
    <p className="text-gray-500 text-sm max-w-md">{description}</p>
  </div>
);

export default PlaceholderPage;

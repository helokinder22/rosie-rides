import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Layout({ children }) {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        return null;
      }
    },
  });

  const fontSize = user?.font_size || 'medium';

  const fontSizeScales = {
    'small': '0.875',
    'medium': '1',
    'large': '1.125',
    'extra-large': '1.25'
  };

  return (
    <div style={{ 
      '--font-scale': fontSizeScales[fontSize],
      fontSize: `calc(${fontSizeScales[fontSize]} * 1rem)`
    }}>
      <style>{`
        body {
          font-size: calc(${fontSizeScales[fontSize]} * 16px);
        }
        h1, h2, h3, h4, h5, h6, p, span, button, a, input, textarea, select, label {
          font-size: inherit;
        }
      `}</style>
      {children}
    </div>
  );
}
export function LandingIllustration({ className }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>
        <circle cx="256" cy="256" r="200" stroke="hsl(var(--border))" strokeWidth="2" />
        <path d="M168 188L256 256L344 188" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round"/>
        <path d="M168 324L256 256L344 324" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="256" cy="256" r="30" fill="url(#grad1)" />
        <circle cx="256" cy="256" r="10" fill="hsl(var(--primary-foreground))" />
        
        <g transform="translate(256, 256)">
          {[...Array(6)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 60})`}>
              <circle cx="120" cy="0" r="20" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
              <line x1="30" y1="0" x2="100" y2="0" stroke="hsl(var(--border))" strokeWidth="2" />
            </g>
          ))}
        </g>
         <g transform="translate(256, 256)">
          {[...Array(6)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 60 + 30})`}>
              <circle cx="180" cy="0" r="15" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="2" />
              <line x1="140" y1="0" x2="165" y2="0" stroke="hsl(var(--border))" strokeWidth="2" />
            </g>
          ))}
        </g>
      </svg>
    );
  }
  
interface PageHeaderProps {
    title: string;
    description?: string;
}
  
export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <header>
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                {title}
            </h1>
            {description && (
                <p className="mt-2 text-lg text-muted-foreground">
                    {description}
                </p>
            )}
        </header>
    );
}

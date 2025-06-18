export const AccordionHeader = ({ num, icon, title, subtitle, primaryColor }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
        <div style={{
            width: '3rem', height: '3rem',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}bb 100%)`,
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontSize: '1.2rem'
        }}>
            <i className={`pi ${icon}`}></i>
        </div>
        <div style={{ flex: 1 }}>
            <span style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 600,
                color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>{num}</span>
            <span style={{
                display: 'block', fontSize: '1.1rem', fontWeight: 600,
                color: '#2d3748', margin: '0.2rem 0'
            }}>{title}</span>
            <span style={{ fontSize: '0.9rem', color: '#718096' }}>{subtitle}</span>
        </div>
    </div>
);

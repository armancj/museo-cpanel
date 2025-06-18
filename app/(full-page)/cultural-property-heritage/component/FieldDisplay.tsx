import { creamBg, formatDate, primaryColor } from '@/app/(full-page)/cultural-property-heritage/util/culture-function';

export const FieldDisplay = ({
    label,
    value,
    type = 'text',
    isArray = false,
    className = '',
    icon,
}: {
    label: string;
    value: any;
    type?: 'text' | 'number' | 'date' | 'boolean';
    isArray?: boolean;
    className?: string;
    icon?: string;
}) => {
    const displayValue = () => {
        if (value === undefined || value === null || value === '') return 'No especificado';

        if (isArray && Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : 'No especificado';
        }

        switch (type) {
            case 'date':
                return formatDate(value);
            case 'boolean':
                return value ? 'Sí' : 'No';
            case 'number':
                return value === 0 ? '0' : value || 'No especificado';
            default:
                return value || 'No especificado';
        }
    };

    const isEmpty = !value || (isArray && Array.isArray(value) && value.length === 0) || value === '';

    return (
        <div
            className={`${className}`}
            style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                borderRadius: '8px',
                background: isEmpty ? '#f8f9fa' : creamBg,
                border: `1px solid ${primaryColor}30`,
                transition: 'all 0.3s ease',
                opacity: isEmpty ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${primaryColor}25`;
                e.currentTarget.style.borderColor = primaryColor;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = `${primaryColor}30`;
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                    color: primaryColor,
                    fontSize: '0.9rem'
                }}
            >
                {icon && <i className={`${icon}`} style={{ color: primaryColor, fontSize: '0.9rem', marginRight: '0.5rem' }}></i>}
                <span>{label}</span>
            </div>
            <div
                style={{
                    color: '#4a5568',
                    lineHeight: 1.5,
                    fontSize: '0.95rem'
                }}
            >
                {displayValue()}
            </div>
        </div>
    );
};

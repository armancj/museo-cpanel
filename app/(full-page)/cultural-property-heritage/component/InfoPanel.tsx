import { FieldDisplay } from '@/app/(full-page)/cultural-property-heritage/component/FieldDisplay';
import { Panel } from 'primereact/panel';

export const InfoPanel = ({ title, icon, fields, primaryColor, cols = 'col-12' }: any) => (
    <div className={cols}>
        <Panel
            header={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className={`pi ${icon}`} style={{ color: primaryColor }}></i>
                    <span>{title}</span>
                </div>
            }
            style={{
                background: 'white', border: 'none', borderRadius: '12px',
                boxShadow: `0 2px 8px ${primaryColor}10`, marginBottom: '1.5rem'
            }}
        >
            <div className="grid">
                {fields.map(({ label, value, icon, type, cols = 'col-12' }: any, idx: number) => (
                    <div key={idx} className={cols}>
                        <FieldDisplay label={label} value={value} icon={icon} type={type} />
                    </div>
                ))}
            </div>
        </Panel>
    </div>
);

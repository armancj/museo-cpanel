import { ConservationStatusResponse } from '@/app/service/ConservationStatusService';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

interface DataFormProps {
    data: ConservationStatusResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
}

export function DataForm({ data, onInputChange, submitted }: DataFormProps) {
    return (
        <div className="formgrid grid">
            <div className="field col-12">
                <label htmlFor="name">Nombre</label>
                <InputText
                    id="name"
                    value={data.name}
                    onChange={(e) => onInputChange(e, 'name')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !data.name })}
                />
                {submitted && !data.name && <small className="p-error">El nombre es requerido.</small>}
            </div>
            <div className="field col-12">
                <label htmlFor="description">Descripción</label>
                <InputTextarea
                    id="description"
                    value={data.description}
                    onChange={(e) => onInputChange(e, 'description')}
                    rows={3}
                    cols={20}
                />
            </div>
        </div>
    );
}

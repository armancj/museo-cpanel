import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { InputSwitch } from 'primereact/inputswitch';
import { DescriptionInstrumentsResponse } from '@/app/service/DescriptionInstrumentsService';

interface MuseumCategoryFormProps {
    data: DescriptionInstrumentsResponse;
    submitted: boolean;
    setSubmitted: (value: boolean) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
}

const DescriptionInstrumentsForm: React.FC<MuseumCategoryFormProps> = ({
                                                                   data,
                                                                   submitted,
                                                                   onInputChange,
                                                               }) => {

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
        <form className="p-fluid">
            {/* Campo: Nombre */}
            <div className="field col-12">
                <label htmlFor="name" className={classNames({ 'p-error': submitted && !data.name })}>
                    Nombre
                </label>
                <InputText
                    id="name"
                    name="name"
                    value={data.name || ''}
                    onChange={(e) => onInputChange(e, 'name')}
                    className={classNames({ 'p-invalid': submitted && !data.name })}
                />
                {submitted && !data.name && (
                    <small className="p-error">El nombre es obligatorio.</small>
                )}
            </div>

            {/* Campo: Activo */}
            <div className="col-12 md:col-4">

            <InputSwitch
                inputId="active"
                name="active"
                checked={data.active}
                tooltip={`El estado está ${data.active ? 'activo' : 'inactivo'}`}
                onChange={(e) => onInputChange(e as any, 'active' )}
            />
            </div>
        </form>
            </div>
            </div>
            </div>
            </div>
    );
};

export default DescriptionInstrumentsForm;

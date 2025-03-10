import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { NomenclatureAccessConditionsResponse } from '@/app/service/NomenclatureAccessConditionsService';

interface MuseumCategoryFormProps {
    data: NomenclatureAccessConditionsResponse;
    submitted: boolean;
    setSubmitted: (value: boolean) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
}

const NomenclatureAccessConditionsForm: React.FC<MuseumCategoryFormProps> = ({
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
                <label htmlFor="type" className={classNames({ 'p-error': submitted && !data.type })}>
                    Tipo
                </label>
                <InputText
                    id="type"
                    name="type"
                    value={data.type || ''}
                    onChange={(e) => onInputChange(e, 'type')}
                    className={classNames({ 'p-invalid': submitted && !data.type })}
                />
                {submitted && !data.type && (
                    <small className="p-error">El tipo es obligatorio.</small>
                )}
            </div>

            {/* Campo: Descripción */}
            <div className="field col-12">
                <label htmlFor="description" className={classNames({ 'p-error': submitted && !data.description })}>
                    Descripción
                </label>
                <InputTextarea
                    id="description"
                    name="description"
                    rows={4}
                    value={data.description || ''}
                    onChange={(e) => onInputChange(e, 'description')}
                    className={classNames({
                        'p-invalid': submitted && !data.description,
                    })}
                />
                {submitted && !data.description && (
                    <small className="p-error">La descripción es obligatoria.</small>
                )}
            </div>
        </form>
            </div>
            </div>
            </div>
            </div>
    );
};

export default NomenclatureAccessConditionsForm;

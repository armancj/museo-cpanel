import { Button } from 'primereact/button';
import React from 'react';
import { Dialog } from 'primereact/dialog';

export function NavigationButtons({
                                      goToPreviousStep,
                                      goToNextStep,
                                      finalizeForm,
                                      showPrevious = true,
                                      showNext = true,
                                      showFinalize = true,
                                      dialog,
                                      footer,
                                      onHide,
                                  }: {
                                      goToPreviousStep?: () => void,
                                      goToNextStep?: () => void,
                                      finalizeForm?: () => void,
                                      showPrevious?: boolean,
                                      showNext?: boolean,
                                      showFinalize?: boolean,
                                      dialog?: boolean | undefined,
                                      footer?: React.JSX.Element | undefined,
                                      onHide?: () => void
                                  },
) {
    return <div className="flex justify-content-between pt-4">
        {showPrevious && goToPreviousStep && (
            <Button
                label="Atrás"
                icon="pi pi-arrow-left"
                onClick={goToPreviousStep}
            />
        )}
        {showNext && goToNextStep && (
            <Button
                label="Siguiente"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={goToNextStep}
            />
        )}
        {showFinalize && finalizeForm && (
            <Dialog
                visible={dialog}
                header="Detalles de la Categoría"
                modal
                className="p-fluid"
                footer={footer}
                onHide={onHide!}
            >
            <Button
                label="Finalizar"
                icon="pi pi-check"
                onClick={finalizeForm}

            />
            </Dialog>

        )}
    </div>;
}

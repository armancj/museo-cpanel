import { Button } from 'primereact/button';
import React from 'react';

type props = {
    goToPreviousStep?: () => void,
    goToNextStep?: () => void,
    finalizeForm?: () => void,
    showPrevious?: boolean,
    showNext?: boolean,
    showFinalize?: boolean,
    onHide?: () => void,
}

export function NavigationButtons({
                                      goToPreviousStep,
                                      goToNextStep,
                                      finalizeForm,
                                      showPrevious = true,
                                      showNext = true,
                                      showFinalize = true,
                                  }: Readonly<props>,
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
            <Button
                label="Finalizar"
                icon="pi pi-check"
                onClick={finalizeForm}
            />
        )}
    </div>;
}

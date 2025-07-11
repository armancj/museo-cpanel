import React from 'react';
import { Menu } from 'primereact/menu';
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';

export function CreateCulturalObjectComponent(props: {
    loading: boolean;
    topThreeTypes: { label: string; value: string }[];
    callbackfn: (type: any, index: any) => React.JSX.Element;
    heritageTypes: { label: string; value: string }[];
    onClick: (e: any) => void | undefined;
    ref: React.MutableRefObject<Menu | null>;
    moreOptionsMenu: {
        label: string;
        icon: string;
        items: { label: string; icon: string; command: () => void }[];
    } | null;
}) {
    return (
        <div className="col-12 mb-4">
            <div className="surface-card p-4 shadow-2 border-round">
                <div className="flex align-items-center justify-content-between mb-4">
                    <div>
                        <h5 className="m-0 mb-2">Crear Patrimonio Cultural</h5>
                        <p className="text-600 m-0">Selecciona el tipo de patrimonio que deseas crear</p>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-plus-circle text-primary text-2xl"></i>
                        <Tooltip target=".heritage-type-btn" />
                    </div>
                </div>

                {/* Estado de carga */}
                {props.loading ? (
                    <div className="flex justify-content-center align-items-center p-4">
                        <div className="flex flex-column align-items-center gap-3">
                            <i className="pi pi-spin pi-spinner text-primary" style={{ fontSize: '2rem' }}></i>
                            <span className="text-600">Cargando tipos de patrimonio...</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {/* Botones principales con mejor diseño */}
                        {props.topThreeTypes.map(props.callbackfn)}

                        {/* Botón "Más tipos" solo si hay más de 3 tipos */}
                        {props.heritageTypes.length > 3 && (
                            <div className="flex-1 min-w-0">
                                <Button
                                    className="w-full p-3 border-2 bg-purple-100 border-purple-200 text-purple-600 hover:bg-purple-200 transition-all transition-duration-200"
                                    style={{
                                        minHeight: '80px',
                                        backgroundColor: 'transparent',
                                        border: '2px solid var(--purple-200)',
                                        color: 'var(--purple-600)'
                                    }}
                                    onClick={props.onClick}
                                    aria-controls="more_options_menu"
                                    aria-haspopup
                                    tooltip="Ver más tipos de patrimonio"
                                    tooltipOptions={{ position: 'top' }}
                                >
                                    <div className="flex flex-column align-items-center gap-2 w-full">
                                        <i className="pi pi-ellipsis-h text-2xl"></i>
                                        <span className="font-medium text-sm line-height-3 text-center">
                                            Más tipos
                                            <br />
                                            <small className="text-xs opacity-70">({props.heritageTypes.length - 3} más)</small>
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Mensaje cuando no hay tipos disponibles */}
                {!props.loading && props.heritageTypes.length === 0 && (
                    <div className="text-center p-4">
                        <div className="flex flex-column align-items-center gap-3">
                            <i className="pi pi-info-circle text-4xl text-400"></i>
                            <div>
                                <h6 className="m-0 mb-2">No hay tipos de patrimonio disponibles</h6>
                                <p className="text-600 m-0">Contacta al administrador para configurar los tipos de patrimonio</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Menú mejorado */}
            <Menu ref={props.ref} id="more_options_menu" popup model={props.moreOptionsMenu ? [props.moreOptionsMenu] : []} style={{ minWidth: '250px' }} />
        </div>
    );
}

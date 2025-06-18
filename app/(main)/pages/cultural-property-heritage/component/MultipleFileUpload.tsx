import React, { useRef, useState, useEffect } from 'react';
import {
    FileUpload,
    FileUploadHeaderTemplateOptions,
    FileUploadSelectEvent,
    FileUploadUploadEvent,
    ItemTemplateOptions,
} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';

interface MultipleFileUploadProps {
    handleFilesUpload: (files: File[]) => void;
    fileURLs?: string[];
    accept?: string;
    maxFileSize?: number;
    maxFilesCount?: number;
    title?: string;
}

const MultipleFileUpload = ({
    handleFilesUpload,
    fileURLs = [],
    accept = "image/*,video/*,audio/*",
    maxFileSize = 10000000, // 10MB default
    maxFilesCount = 10,
    title = "Archivos"
}: MultipleFileUploadProps) => {
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = totalSize;
        let files = e.files;

        // Check if we're exceeding the maximum number of files
        if (fileUploadRef.current && fileUploadRef.current.getFiles().length + files.length > maxFilesCount) {
            // Show error message
            alert(`No se pueden subir más de ${maxFilesCount} archivos.`);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0;
        }

        setTotalSize(_totalSize);

        // Pass the files to the parent component
        if (fileUploadRef.current) {
            const currentFiles = fileUploadRef.current.getFiles();
            const allFiles = [...currentFiles, ...files];
            handleFilesUpload(allFiles);
        }
    };

    const onTemplateClear = () => {
        setTotalSize(0);
        handleFilesUpload([]);
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(totalSize - file.size);
        callback();

        // Update the parent component with the remaining files
        if (fileUploadRef.current) {
            const currentFiles = fileUploadRef.current.getFiles();
            const remainingFiles = currentFiles.filter(f => f !== file);
            handleFilesUpload(remainingFiles);
        }
    };

    useEffect(() => {
        const fetchAndSetFiles = async () => {
            if (fileURLs && fileURLs.length > 0) {
                try {
                    const files = await Promise.all(
                        fileURLs.map(async (url, index) => {
                            const response = await fetch(url);
                            const blob = await response.blob();

                            // Determine file type and name from URL
                            let fileName = `file-${index}`;
                            let fileType = blob.type;

                            if (url.includes('/')) {
                                const urlParts = url.split('/');
                                fileName = urlParts[urlParts.length - 1];
                            }

                            return new File([blob], fileName, { type: fileType });
                        })
                    );

                    if (fileUploadRef.current) {
                        fileUploadRef.current.setFiles(files);

                        // Calculate total size
                        const newTotalSize = files.reduce((sum, file) => sum + file.size, 0);
                        setTotalSize(newTotalSize);

                        // Notify parent component
                        handleFilesUpload(files);
                    }
                } catch (error) {
                    console.error('Error al descargar y configurar los archivos:', error);
                }
            }
        };

        fetchAndSetFiles();
    }, [fileURLs]);

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / maxFileSize * 100;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';
        const maxSizeFormatted = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(maxFileSize) : '10 MB';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / {maxSizeFormatted}</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;

        // Determine icon based on file type
        let icon = 'pi-file';
        let severity = 'info';

        if (file.type.startsWith('image/')) {
            icon = 'pi-image';
            severity = 'success';
        } else if (file.type.startsWith('video/')) {
            icon = 'pi-video';
            severity = 'warning';
        } else if (file.type.startsWith('audio/')) {
            icon = 'pi-volume-up';
            severity = 'danger';
        }

        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    {file.type.startsWith('image/') && (file as any).objectURL ? (
                        <img alt={file.name} role="presentation" src={(file as any).objectURL} width={100} />
                    ) : (
                        <i className={`pi ${icon} text-2xl`}></i>
                    )}
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity={severity as any} className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-cloud-upload mt-3 p-5" style={{
                    fontSize: '5em',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-b)',
                    color: 'var(--surface-d)',
                }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Arrastre y suelte archivos aquí
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: 'pi pi-fw pi-plus',
        iconOnly: true,
        className: 'custom-choose-btn p-button-success p-button-rounded p-button-outlined h-2rem w-2rem',
    };

    const cancelOptions = {
        icon: 'pi pi-fw pi-times',
        iconOnly: true,
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined h-2rem w-2rem',
    };

    return (
        <div>
            <h3>{title}</h3>
            <Tooltip target=".custom-choose-btn" content="Elegir archivos" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Limpiar" position="bottom" />

            <FileUpload
                ref={fileUploadRef}
                name="files[]"
                multiple
                accept={accept}
                maxFileSize={maxFileSize}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
            />

            <div className="mt-2 text-sm text-gray-500">
                Tipos de archivo permitidos: {accept.replace(/\*/g, 'todos')}
            </div>
            <div className="text-sm text-gray-500">
                Tamaño máximo: {fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(maxFileSize) : '10 MB'}
            </div>
            <div className="text-sm text-gray-500">
                Máximo {maxFilesCount} archivos
            </div>
        </div>
    );
};

export default MultipleFileUpload;

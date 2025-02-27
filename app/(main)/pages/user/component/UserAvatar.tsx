import React, { useRef, useState, useEffect } from 'react';
import {
    FileUpload,
    FileUploadHeaderTemplateOptions,
    FileUploadSelectEvent,
    FileUploadUploadEvent, ItemTemplateOptions,
} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';

interface UserAvatarProps {
    handleImageUpload: (file: File) => void;
    avatarURL: string | undefined;
}


const UserAvatar = ({ handleImageUpload, avatarURL }: UserAvatarProps) => {
    const onSelect = (e: { files: File[] }) => {
        if (e.files && e.files.length > 0) {
            handleImageUpload(e.files[0]);
        }
    };

    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = totalSize;
        let files = e.files;

        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0;
        }

        setTotalSize(_totalSize);

        onSelect(e)
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => { };


    const onTemplateClear = () => {
        setTotalSize(0);
        onSelect({} as any)
    };

    useEffect(() => {
        const fetchAndSetFile = async () => {
            if (avatarURL) {
                try {
                    const response = await fetch(avatarURL);
                    const blob = await response.blob();
                    const file = new File([blob], 'avatar.jpg', { type: blob.type });
                    fileUploadRef?.current?.setFiles([file])
                } catch (error) {
                    console.error('Error al descargar y configurar el archivo:', error);
                }
            }
        };

        fetchAndSetFile();
    }, [avatarURL]);


    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className}
                 style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false}
                                 style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={(file as any)?.objectURL ?? avatarURL } width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {'Avatar'}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{
                    fontSize: '5em',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-b)',
                    color: 'var(--surface-d)',
                }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: 'pi pi-fw pi-images',
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
            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload
                ref={fileUploadRef}
                name="avatar" accept="image/*" maxFileSize={1000000}
                        onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                        headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                        chooseOptions={chooseOptions} cancelOptions={cancelOptions} />
        </div>
    );
};

export default UserAvatar;

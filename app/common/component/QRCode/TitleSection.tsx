import { truncateTitle } from '@/app/common/component/QRCode/util/createCleanFilename';
import { TITLE_MAX_LENGTH } from '@/app/common/component/QRCode/types';

export const TitleSection = ({ title }: { title: string }) => (
    <div className="mb-4 w-full">
        <h4
            className="m-0 text-900 font-medium line-height-3"
            style={{
                wordBreak: 'break-word',
                hyphens: 'auto'
            }}
            title={title}
        >
            {truncateTitle(title, TITLE_MAX_LENGTH)}
        </h4>
        {title.length > TITLE_MAX_LENGTH && (
            <small className="text-500 mt-1 block">
                Título completo disponible al pasar el cursor
            </small>
        )}
    </div>
);

# Museo CPanel

## QR Code Functionality

This project includes a QR code generation feature for cultural heritage properties. To use this feature, you need to install the `qrcode.react` library:

```bash
# Using npm
npm install qrcode.react

# Using pnpm
pnpm add qrcode.react
```

## How to Use the QR Code Feature

1. Navigate to the Cultural Heritage Property list page
2. Click on the QR code button (🔳) for any property in the list
3. A dialog will appear with a QR code that links to the public view of the property
4. You can download the QR code as a PNG image by clicking the "Descargar" button
5. When scanned, the QR code will direct users to a public page showing the property details

## Public View URL Structure

The QR code contains a URL with the following structure:

```
https://your-domain.com/cultural-property-heritage/{uuid}
```

Where `{uuid}` is the unique identifier of the cultural heritage property.

## Implementation Details

The QR code functionality is implemented using the following components:

- `QRCodeDialog.tsx`: A dialog component that displays the QR code and provides a download button
- `CulturalHeritagePropertyList.tsx`: The list component that includes a button to generate QR codes for each property
- `[uuid]/page.tsx`: A public page that displays the details of a cultural heritage property

The public view endpoint (`/cultural-heritage-property/public/{uuid}`) is used to fetch the property data without requiring authentication.

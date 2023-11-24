import { QrScanner } from '@yudiel/react-qr-scanner';

export default function QRReader() {
  return (
    <div className="flex items-center flex-col justify-center w-full h-screen">
      <h1 className="text-2xl text-center font-bold tracking-tight text-white">Scan the QR code that is shown on the generate page</h1>
      <QrScanner
        onDecode={(result) => console.log(result)}
        onError={(error) => console.log(error?.message)}
        containerStyle={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px' }}
      />
    </div>
  );
}

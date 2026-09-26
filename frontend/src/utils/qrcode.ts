import QRCode from 'qrcode';
import { supabase } from '@/integrations/supabase/client';

export async function generateBusinessQRCode(businessSlug: string, businessId: string): Promise<string | null> {
  try {
    const baseUrl = window.location.origin;
    const businessUrl = `${baseUrl}/business/${businessSlug}?source=qr`;
    
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(businessUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#0d9488', // Primary color
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });

    // Convert data URL to blob
    const response = await fetch(qrDataUrl);
    const blob = await response.blob();

    // Upload to Supabase Storage
    const fileName = `${businessId}-qr.png`;
    const { data, error } = await supabase.storage
      .from('qr-codes')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading QR code:', error);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(fileName);

    // Update business with QR code URL
    await supabase
      .from('businesses')
      .update({ qr_code_url: publicUrlData.publicUrl })
      .eq('id', businessId);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}

export async function downloadQRCode(qrCodeUrl: string, businessName: string) {
  try {
    const response = await fetch(qrCodeUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessName.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading QR code:', error);
  }
}

export function generateQRCodeDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 256,
    margin: 2,
    color: {
      dark: '#0d9488',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  });
}

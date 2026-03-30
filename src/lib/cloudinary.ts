// Cloudinary image upload utility
// Separated here so it can be reused across admin, doctor, and patient features.

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
};

/**
 * Upload an image file to Cloudinary via the unsigned upload preset.
 * Used for avatar images (patients, doctors, users).
 *
 * @param file  - File object from a form input
 * @param folder - Optional Cloudinary folder path (e.g. "hms/patients")
 */
export async function uploadImageToCloudinary(
  file: File,
  folder = "hms"
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Cloudinary upload failed: ${error.error?.message ?? "Unknown error"}`
    );
  }

  const data = await response.json();

  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    width: data.width as number,
    height: data.height as number,
    format: data.format as string,
  };
}

/**
 * Server-side signed upload using API key + secret.
 * Use this inside API route handlers when you need secure, non-public uploads.
 *
 * @param file       - File Buffer
 * @param fileName   - Original file name (for type detection)
 * @param folder     - Cloudinary folder path
 */
export async function uploadImageServer(
  file: Buffer,
  fileName: string,
  folder = "hms"
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary server credentials are not configured. Check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  // Generate timestamp for signed request
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

  // Sign using SHA-1 (Web Crypto API — available in Next.js edge/node)
  const encoder = new TextEncoder();
  const keyData = encoder.encode(apiSecret);
  const messageData = encoder.encode(paramsToSign);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([file as unknown as ArrayBuffer]),
    fileName
  );
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Cloudinary upload failed: ${error.error?.message ?? "Unknown error"}`
    );
  }

  const data = await response.json();

  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    width: data.width as number,
    height: data.height as number,
    format: data.format as string,
  };
}

const path = require("path");
const crypto = require("crypto");

/**
 * Uploads a file buffer directly to Bunny.net Storage
 * @param {Buffer} fileBuffer - The file buffer in memory
 * @param {string} originalFilename - Original name of uploaded file
 * @param {string} mimeType - File MIME type (e.g. image/jpeg)
 * @param {string} folder - Destination folder in storage zone
 * @returns {Promise<string>} Public CDN URL of the uploaded file
 */
const uploadToBunny = async (
  fileBuffer,
  originalFilename,
  mimeType = "image/jpeg",
  folder = "fuel-bills"
) => {
  const storageZone = process.env.BUNNY_STORAGE_ZONE;
  const accessKey = process.env.BUNNY_ACCESS_KEY;
  const storageEndpoint =
    process.env.BUNNY_STORAGE_ENDPOINT || "https://sg.storage.bunnycdn.com";
  const pullZoneUrl =
    process.env.BUNNY_PULL_ZONE_URL || "https://sri-murugan.b-cdn.net";

  if (!storageZone || !accessKey) {
    throw new Error("Bunny storage configuration is missing in environment variables.");
  }

  // Generate safe unique filename
  const ext = path.extname(originalFilename || "") || ".jpg";
  const randomSuffix = crypto.randomBytes(6).toString("hex");
  const filename = `fuel_${Date.now()}_${randomSuffix}${ext}`;

  // Bunny Storage URL: https://{endpoint}/{storageZoneName}/{folder}/{filename}
  const cleanEndpoint = storageEndpoint.replace(/\/+$/, "");
  const uploadUrl = `${cleanEndpoint}/${storageZone}/${folder}/${filename}`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: accessKey,
      "Content-Type": mimeType || "application/octet-stream",
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to upload to Bunny Storage: HTTP ${response.status} - ${errorText}`
    );
  }

  // Public CDN URL: https://{pullZoneUrl}/{folder}/{filename}
  const cleanPullZone = pullZoneUrl.replace(/\/+$/, "");
  return `${cleanPullZone}/${folder}/${filename}`;
};

/**
 * Deletes a file from Bunny.net Storage using its CDN URL
 * @param {string} fileUrl - Full CDN URL of the file
 * @returns {Promise<boolean>}
 */
const deleteFromBunny = async (fileUrl) => {
  if (!fileUrl) return false;

  try {
    const storageZone = process.env.BUNNY_STORAGE_ZONE;
    const accessKey = process.env.BUNNY_ACCESS_KEY;
    const storageEndpoint =
      process.env.BUNNY_STORAGE_ENDPOINT || "https://sg.storage.bunnycdn.com";
    const pullZoneUrl =
      process.env.BUNNY_PULL_ZONE_URL || "https://sri-murugan.b-cdn.net";

    if (!storageZone || !accessKey) return false;

    // Extract path from CDN URL
    const cleanPullZone = pullZoneUrl.replace(/\/+$/, "");
    if (!fileUrl.startsWith(cleanPullZone)) return false;

    const relativePath = fileUrl.replace(cleanPullZone, "").replace(/^\/+/, "");
    const cleanEndpoint = storageEndpoint.replace(/\/+$/, "");
    const deleteUrl = `${cleanEndpoint}/${storageZone}/${relativePath}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        AccessKey: accessKey,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting file from Bunny:", error);
    return false;
  }
};

module.exports = {
  uploadToBunny,
  deleteFromBunny,
};

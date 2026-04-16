import crypto from "node:crypto"

export const runtime = "nodejs"

function createSignature(params, apiSecret) {
  const paramsToSign = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  return crypto.createHash("sha1").update(`${paramsToSign}${apiSecret}`).digest("hex")
}

export async function POST(request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return Response.json(
        { error: "Missing Cloudinary configuration." },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file")
    const folder = formData.get("folder") || "portfolio"

    if (!(file instanceof File)) {
      return Response.json({ error: "No file uploaded." }, { status: 400 })
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const signature = createSignature({ folder, timestamp }, apiSecret)

    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append("file", file)
    cloudinaryFormData.append("api_key", apiKey)
    cloudinaryFormData.append("timestamp", String(timestamp))
    cloudinaryFormData.append("signature", signature)
    cloudinaryFormData.append("folder", String(folder))

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: cloudinaryFormData,
    })

    const uploadResult = await uploadResponse.json()

    if (!uploadResponse.ok) {
      return Response.json(
        { error: uploadResult.error?.message || "Cloudinary upload failed." },
        { status: uploadResponse.status },
      )
    }

    return Response.json({
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      secureUrl: uploadResult.secure_url,
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)

    return Response.json(
      { error: "Unable to upload file right now." },
      { status: 500 },
    )
  }
}

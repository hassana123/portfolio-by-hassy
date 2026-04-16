export async function uploadMedia(file, folder = "portfolio") {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Upload failed")
  }

  return data
}

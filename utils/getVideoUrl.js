export default function getVideoUrl({
  video,
}) {
  const splittedId = video.split('-')
  const uid = splittedId[1]
  const extension = splittedId[2]

  return `https://cdn.sanity.io/files/uy8m3uc4/production/${uid}.${extension}`
}
export function downloadTag(tagCanvas: HTMLCanvasElement) {
  // Convert canvas to data URL
  const dataUrl = tagCanvas.toDataURL("image/png");

  // Create a temporary link element
  const link = document.createElement("a");

  // Set the href attribute with the data URL
  link.href = dataUrl;

  // Set the download attribute with a desired filename
  link.download = "tag.png";

  // Append the link to the body
  document.body.appendChild(link);

  // Trigger a click on the link to start the download
  link.click();

  // Remove the link from the body
  document.body.removeChild(link);
}

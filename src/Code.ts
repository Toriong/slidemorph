/**
 * SlideMorph - Insert HEIC, PDF pages, SVG, WebP and AVIF images into Google Slides
 * Converts unsupported formats to PNG client-side and inserts them into slides
 */

const PROPERTIES_KEY = 'hasSeenOnboarding';
const DRIVE_IO_HOME = 'https://www.driveio.io/?referrer=SlideMorph';
const DRIVE_IO_COPY_FOLDER = 'https://www.driveio.io/standalone-plans/copy-folder-in-google-drive-extension?referrer=SlideMorph';

/**
 * Called when add-on is installed
 */
function onInstall(): void {
  onOpen();
}

/**
 * Called when presentation is opened
 */
function onOpen(): void {
  SlidesApp.getUi()
    .createAddonMenu()
    .addItem('Open SlideMorph', 'showSidebar')
    .addSeparator()
    .addItem('Visit Drive I/O', 'openDriveIO')
    .addItem('Copy Folder Extension', 'openCopyFolder')
    .addToUi();
}

/**
 * Shows the sidebar
 */
function showSidebar(): void {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('SlideMorph')
    .setWidth(320);
  
  SlidesApp.getUi().showSidebar(htmlOutput);
}

/**
 * Marks onboarding as complete
 */
function markOnboardingComplete(): void {
  PropertiesService.getUserProperties().setProperty(PROPERTIES_KEY, 'true');
}

/**
 * Checks if user has seen onboarding
 */
function hasSeenOnboarding(): boolean {
  return PropertiesService.getUserProperties().getProperty(PROPERTIES_KEY) === 'true';
}

/**
 * Opens Drive I/O home page
 */
function openDriveIO(): void {
  const html = `<script>window.open('${DRIVE_IO_HOME}', '_blank');google.script.host.close();</script>`;
  const ui = HtmlService.createHtmlOutput(html);
  SlidesApp.getUi().showModalDialog(ui, 'Opening Drive I/O...');
}

/**
 * Opens Drive I/O Copy Folder page
 */
function openCopyFolder(): void {
  const html = `<script>window.open('${DRIVE_IO_COPY_FOLDER}', '_blank');google.script.host.close();</script>`;
  const ui = HtmlService.createHtmlOutput(html);
  SlidesApp.getUi().showModalDialog(ui, 'Opening Copy Folder Extension...');
}

/**
 * Inserts an image on the current slide
 */
function insertImageOnSlide(dataUrl: string, fileName: string): { success: boolean; error?: string } {
  try {
    const presentation = SlidesApp.getActivePresentation();
    const currentPage = presentation.getSelection().getCurrentPage();
    
    if (!currentPage || currentPage.getPageType() !== SlidesApp.PageType.SLIDE) {
      return { success: false, error: 'Please select a slide first' };
    }
    
    const slide = currentPage.asSlide();
    
    // Convert data URL to blob
    const base64Data = dataUrl.split(',')[1];
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      'image/png',
      fileName
    );
    
    // Insert image at center of slide
    const pageWidth = presentation.getPageWidth();
    const pageHeight = presentation.getPageHeight();
    
    slide.insertImage(blob, pageWidth / 4, pageHeight / 4, pageWidth / 2, pageHeight / 2);
    
    return { success: true };
  } catch (error) {
    console.error('Error inserting image:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Replaces the selected image
 */
function replaceSelectedImage(dataUrl: string, fileName: string): { success: boolean; error?: string } {
  try {
    const presentation = SlidesApp.getActivePresentation();
    const selection = presentation.getSelection();
    const pageElements = selection.getPageElementRange()?.getPageElements();
    
    if (!pageElements || pageElements.length === 0) {
      return { success: false, error: 'Please select an image first' };
    }
    
    const selectedElement = pageElements[0];
    
    if (selectedElement.getPageElementType() !== SlidesApp.PageElementType.IMAGE) {
      return { success: false, error: 'Selected element is not an image' };
    }
    
    const image = selectedElement.asImage();
    
    // Convert data URL to blob
    const base64Data = dataUrl.split(',')[1];
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      'image/png',
      fileName
    );
    
    image.replace(blob);
    
    return { success: true };
  } catch (error) {
    console.error('Error replacing image:', error);
    return { success: false, error: String(error) };
  }
}

// Export functions for Apps Script
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).onInstall = onInstall;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).onOpen = onOpen;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).showSidebar = showSidebar;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).markOnboardingComplete = markOnboardingComplete;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).hasSeenOnboarding = hasSeenOnboarding;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).openDriveIO = openDriveIO;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).openCopyFolder = openCopyFolder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).insertImageOnSlide = insertImageOnSlide;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).replaceSelectedImage = replaceSelectedImage;

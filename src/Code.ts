/**
 * SlideMorph - Convert and insert images into Google Slides
 * Supports HEIC, PDF pages, SVG, WebP, and AVIF formats
 */

/**
 * Creates the add-on menu when document is opened
 */
function onOpen() {
  const ui = SlidesApp.getUi();
  ui.createAddonMenu()
    .addItem('Open SlideMorph', 'showSidebar')
    .addToUi();
}

/**
 * Handles add-on installation
 */
function onInstall() {
  onOpen();
}

/**
 * Shows the sidebar UI
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('SlideMorph')
    .setWidth(320);
  
  SlidesApp.getUi().showSidebar(html);
  
  // Mark as not first run
  const userProps = PropertiesService.getUserProperties();
  if (!userProps.getProperty('hasSeenWelcome')) {
    userProps.setProperty('hasSeenWelcome', 'true');
  }
}

/**
 * Checks if this is the user's first time using the add-on
 */
function isFirstRun(): boolean {
  const userProps = PropertiesService.getUserProperties();
  return !userProps.getProperty('hasSeenWelcome');
}

/**
 * Inserts an image blob into the current slide
 */
function insertImage(imageData: string, mimeType: string): { success: boolean; message: string } {
  try {
    const presentation = SlidesApp.getActivePresentation();
    const selection = presentation.getSelection();
    const currentPage = selection.getCurrentPage();
    
    if (!currentPage || currentPage.getPageType() !== SlidesApp.PageType.SLIDE) {
      return { success: false, message: 'No slide selected. Please select a slide first.' };
    }

    const slide = currentPage.asSlide();

    // Decode base64 to blob
    const base64Data = imageData.split(',')[1];
    const bytes = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(bytes, mimeType, 'image.png');
    
    // Insert image in the center of the slide
    const pageWidth = presentation.getPageWidth();
    const pageHeight = presentation.getPageHeight();
    const image = slide.insertImage(blob);
    
    // Center the image
    const imgWidth = image.getWidth();
    const imgHeight = image.getHeight();
    image.setLeft((pageWidth - imgWidth) / 2);
    image.setTop((pageHeight - imgHeight) / 2);
    
    return { success: true, message: 'Image inserted successfully!' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error inserting image:', error);
    return { success: false, message: `Error: ${errorMessage}` };
  }
}

/**
 * Replaces the selected image with a new one
 */
function replaceImage(imageData: string, mimeType: string): { success: boolean; message: string } {
  try {
    const presentation = SlidesApp.getActivePresentation();
    const selection = presentation.getSelection();
    const pageElements = selection.getPageElementRange()?.getPageElements();
    
    if (!pageElements || pageElements.length === 0) {
      return { success: false, message: 'No image selected. Please select an image first.' };
    }

    const element = pageElements[0];
    const image = element.asImage();
    
    if (!image) {
      return { success: false, message: 'Selected element is not an image.' };
    }

    // Decode base64 to blob
    const base64Data = imageData.split(',')[1];
    const bytes = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(bytes, mimeType, 'image.png');
    
    // Replace the image
    image.replace(blob);
    
    return { success: true, message: 'Image replaced successfully!' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error replacing image:', error);
    return { success: false, message: `Error: ${errorMessage}` };
  }
}

/**
 * Gets the homepage card for the add-on
 */
function onHomepage(): GoogleAppsScript.Card_Service.Card {
  const card = CardService.newCardBuilder();
  
  card.setHeader(
    CardService.newCardHeader()
      .setTitle('SlideMorph')
      .setSubtitle('Convert & Insert Images')
      .setImageUrl('https://www.gstatic.com/images/branding/product/1x/slides_48dp.png')
  );

  const section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText('Convert HEIC, PDF pages, SVG, WebP, and AVIF images to PNG and insert them into your slides.')
    )
    .addWidget(
      CardService.newTextButton()
        .setText('Open SlideMorph')
        .setOnClickAction(
          CardService.newAction().setFunctionName('showSidebar')
        )
    );

  const driveSection = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText('<b>Need more Drive tools?</b><br>Check out Drive I/O for advanced Google Drive automation.')
    )
    .addWidget(
      CardService.newTextButton()
        .setText('Learn More About Drive I/O')
        .setOpenLink(
          CardService.newOpenLink()
            .setUrl('https://www.driveio.io/?referrer=SlideMorph')
            .setOpenAs(CardService.OpenAs.FULL_SIZE)
        )
    );

  card.addSection(section);
  card.addSection(driveSection);

  return card.build();
}

// Export functions for Apps Script global scope
globalThis.onOpen = onOpen;
globalThis.onInstall = onInstall;
globalThis.showSidebar = showSidebar;
globalThis.isFirstRun = isFirstRun;
globalThis.insertImage = insertImage;
globalThis.replaceImage = replaceImage;
globalThis.onHomepage = onHomepage;


import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import util from "util";
dotenv.config();
const SLIDES_SCOPE = [
  "https://www.googleapis.com/auth/presentations",
  "https://www.googleapis.com/auth/drive",
];
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
  __dirname,
  "./test-project.json"
);
const PRESENTATION_ID = process.env.GOOGLE_PRESENTATION_ID;
/*
 the editSlides function edits the title slide of a presentation by retrieving the presentation, finding the title element,
preparing batch update requests to replace the title text in all slides, performing the batch update, and renaming the presentation
with the new title.
*/
async function editSlides(
  slides,
  presentationId,
  newTitle,
  newSubTitle,
  newDescription,
  newProductName,
  newProductImageURL,
  newSignatureURL
) {
  // Get the presentation
  const presentation = await slides.presentations.get({ presentationId });

  // Retrieve the current title from the first slide
  const firstSlide = presentation.data.slides[0];
  const DescriptionImageAndProductNameSlide = presentation.data.slides[23];
  const SummaryAndSignature = presentation.data.slides[1];

  console.log(
    "slide 1 JSON:",
    util.inspect(DescriptionImageAndProductNameSlide, {
      showHidden: false,
      depth: null,
    })
  );

  // Find the title element object withing pageElements array
  const titleElement = firstSlide.pageElements.find((element) => {
    return (
      element.shape &&
      element.shape.placeholder &&
      element.shape.placeholder.type === "CENTERED_TITLE"
    );
  });

  const subtitleElement = firstSlide.pageElements.find((element) => {
    return (
      element.shape &&
      element.shape.placeholder &&
      element.shape.placeholder.type === "SUBTITLE"
    );
  });

  const DescriptionElement =
    DescriptionImageAndProductNameSlide.pageElements.find((element) => {
      return (
        element.shape &&
        element.shape.placeholder &&
        element.shape.placeholder.parentObjectId === "g1f27791c03d_0_186"
      );
    });

  const ProductNameElement =
    DescriptionImageAndProductNameSlide.pageElements.find((element) => {
      return (
        element.shape &&
        element.shape.placeholder &&
        element.shape.placeholder.parentObjectId === "g1f27791c03d_0_185"
      );
    });

  const ProductImageElement =
    DescriptionImageAndProductNameSlide.pageElements.find((element) => {
      return element.image && element.objectId === "g21392fc2037_0_3224";
    });

  const SignatureImageElement = SummaryAndSignature.pageElements.find((element) => {
    return element.image && element.objectId === "g21392fc2037_0_2286";
  });



  // console.log(
  //   "slide 1 JSON:",
  //   util.inspect(presentation.data.slides[1], {
  //     showHidden: false,
  //     depth: null,
  //   })
  // );

  // if (!titleElement) {
  //   console.log("Could not find the title element in the first slide.");
  //   return;
  // }
  // if (!subtitleElement) {
  //   console.log("Could not find the subtitle element in the first slide.");
  //   return;
  // }
  // if (!DescriptionElement) {
  //   console.log("Could not find the description element in slide.");
  //   return;
  // }
  // if (!ProductNameElement) {
  //   console.log("Could not find the ProductName element in slide.");
  //   return;
  // }
  // if (!ProductImageElement) {
  //   console.log("Could not find the ProductImage element in slide.");
  //   return;
  // }

  // Extract the current elements from presentation
  const currentTitle =
    titleElement.shape.text.textElements[1].textRun.content.trim();

  const currentSubTitle =
    subtitleElement.shape.text.textElements[1].textRun.content.trim();

  const currentDescription =
    DescriptionElement.shape.text.textElements[1].textRun.content.trim();

  const currentProductName =
    ProductNameElement.shape.text.textElements[1].textRun.content.trim();
  console.log("ProductImageElement", ProductImageElement)

  const currentProductImage = ProductImageElement.image.contentUrl.trim();

  const currentSignatureImage = SignatureImageElement.image.contentUrl.trim();

  // Prepare batch update requests array
  const requests = [];

  for (let slide of presentation.data.slides) {
    // Find the objectId of the text element that contains the current title
    const titleElement = slide.pageElements.find((element) => {
      return (
        element.shape &&
        element.shape.text &&
        element.shape.text.textElements.some((textElement) => {
          return (
            textElement.textRun &&
            textElement.textRun.content.includes(currentTitle)
          );
        })
      );
    });

    // Find the objectId of the text element that contains the current subtitle
    const subtitleElement = slide.pageElements.find((element) => {
      return (
        element.shape &&
        element.shape.text &&
        element.shape.text.textElements.some((textElement) => {
          return (
            textElement.textRun &&
            textElement.textRun.content.includes(currentSubTitle)
          );
        })
      );
    });

    // Find the objectId of the text element that contains the current subtitle
    const DescriptionElement = slide.pageElements.find((element) => {
      return (
        element.shape &&
        element.shape.text &&
        element.shape.text.textElements.some((textElement) => {
          return (
            textElement.textRun &&
            textElement.textRun.content.includes(currentDescription)
          );
        })
      );
    });

    const productNameElement = slide.pageElements.find((element) => {
      return (
        element.shape &&
        element.shape.text &&
        element.shape.text.textElements.some((textElement) => {
          return (
            textElement.textRun &&
            textElement.textRun.content.includes(currentProductName)
          );
        })
      );
    });

    const ProductImageElement = slide.pageElements.find((element) => {
      return (
        element.shape &&
        element.shape.text &&
        element.shape.text.textElements.some((textElement) => {
          return (
            textElement.textRun &&
            textElement.textRun.content.includes(currentProductImage)
          );
        })
      );
    });

    const SignatureImageElement = slide.pageElements.find((element) => {
      return (
        element.shape &&
        element.shape.text &&
        element.shape.text.textElements.some((textElement) => {
          return (
            textElement.textRun &&
            textElement.textRun.content.includes(currentSignatureImage)
          );
        })
      );
    });
    // Prepare replaceAllText request for this slide to replace the title
    requests.push({
      replaceAllText: {
        containsText: {
          text: currentTitle,
          matchCase: true,
        },
        replaceText: newTitle,
      },
    });

    // Prepare replaceAllText request for this slide to replace the subtitle
    if (newSubTitle && newSubTitle.length > 0) {
      requests.push({
        replaceAllText: {
          containsText: {
            text: currentSubTitle,
            matchCase: true,
          },
          replaceText: newSubTitle,
        },
      });
    }
  }
  console.log("currentDescription: ", currentDescription)
  console.log("newDescription: ", newDescription)
  // Prepare replaceAllText request for this slide to replace the subtitle
  if (newDescription.length > 0) {
    requests.push({
      replaceAllText: {
        containsText: {
          text: currentDescription,
          matchCase: true,
        },
        replaceText: newDescription,
      },
    });
  }

  if (newProductName.length > 0) {
    requests.push({
      replaceAllText: {
        containsText: {
          text: currentProductName,
          matchCase: true,
        },
        replaceText: newProductName,
      },
    });
  }



  // Prepare createImage request for this slide to create the new image
  if (newProductImageURL.length > 0) {
    requests.push({
      deleteObject: {
        objectId: ProductImageElement.objectId,
      },
    });
    requests.push({
      createImage: {
        url: newProductImageURL,
        objectId: ProductImageElement.objectId, // Use the same objectId for the new image
        elementProperties: {
          pageObjectId: DescriptionImageAndProductNameSlide.objectId, // The slide where you want the image
          size: ProductImageElement.size, // Use the same size as the old image
          transform: ProductImageElement.transform, // Use the same position as the old image
        },
      },
    });
  }





  // Prepare createImage request for this slide to create the new image
  if (newSignatureURL.length > 0) {
    requests.push({
      deleteObject: {
        objectId: SignatureImageElement.objectId,
      },
    });
    requests.push({
      createImage: {
        url: newSignatureURL,
        objectId: SignatureImageElement.objectId, // Use the same objectId for the new image
        elementProperties: {
          pageObjectId: SummaryAndSignature.objectId, // The slide where you want the image
          size: SignatureImageElement.size, // Use the same size as the old image
          transform: SignatureImageElement.transform, // Use the same position as the old image
        },
      },
    });
  }
  // Perform batch update
  const response = await slides.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests,
    },
  });

  console.log(`Updated the text in ${requests.length} slide(s)`);

  renamePresentation(presentationId, newTitle);
}

async function sharePresentation(drive, presentationId, email) {
  const permissions = {
    type: "user",
    role: "writer",
    emailAddress: email,
  };

  await drive.permissions.create({
    fileId: presentationId,
    resource: permissions,
    fields: "id",
  });

  console.log(`Shared the presentation with ${email}`);
}
/*
the initialPresentationCreation function creates an initial presentation for a proposal. It reads the JSON key file,
authorizes the client, initializes the Google Slides API, retrieves the original presentation, creates a copy with a new name,
 shares the new presentation with the user, edits the title slide, and returns the ID of the new presentation.
*/
export async function initialPresentationCreation(
  userEmail,
  proposalTitle,
  newSubTitle,
  newDescription,
  newProductName,
  newProductImageURL,
  newSignatureURL
) {
  // Read the JSON key file
  const key = JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS));
  const auth = new google.auth.GoogleAuth();
  const jwtClient = auth.fromJSON(key);
  jwtClient.scopes = SLIDES_SCOPE;
  await jwtClient.authorize();
  const slides = google.slides({ version: "v1", auth: jwtClient });

  // Get the presentation title
  const presentation = await slides.presentations.get({
    presentationId: PRESENTATION_ID,
  });
  const title = presentation.data.title; // Duplicate the presentation using the Drive API
  const drive = google.drive({ version: "v3", auth: jwtClient });
  const copyRequest = {
    fileId: PRESENTATION_ID,
    requestBody: {
      name: `${proposalTitle}`,
    },
  };
  const response = await drive.files.copy(copyRequest);
  const NewPresentationID = response.data.id;

  console.log(`Created duplicate presentation with ID: ${NewPresentationID}`);

  // Share the presentation with your personal email
  await sharePresentation(drive, response.data.id, `${userEmail}`); // need userEmail here
  console.log("newSubTitle:", newSubTitle);
  await editSlides(
    slides,
    NewPresentationID,
    proposalTitle,
    newSubTitle,
    newDescription,
    newProductName,
    newProductImageURL,
    newSignatureURL
  );
  return NewPresentationID;
}
/*
the updatePresentation function updates the content of a presentation
 identified by presentationId by editing the title slide with the new proposalTitle
*/
export async function updatePresentation(
  presentationId,
  proposalTitle,
  newSubTitle,
  newDescription,
  newProductName,
  newProductImageURL,
  newSignatureURL
) {
  console.log("updatePresentation called with presentationId:", presentationId);

  // Read the JSON key file
  const key = JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS));

  const auth = new google.auth.GoogleAuth();
  const jwtClient = auth.fromJSON(key);
  jwtClient.scopes = SLIDES_SCOPE;

  // Authorize the jwtClient object
  await jwtClient.authorize();

  const slides = google.slides({ version: "v1", auth: jwtClient });

  console.log(`Adding new proposal presentation title: ${proposalTitle}`);

  // Update the title slide with new content
  console.log("newSubTitle", newSubTitle);
  await editSlides(
    slides,
    presentationId,
    proposalTitle,
    newSubTitle,
    newDescription,
    newProductName,
    newProductImageURL,
    newSignatureURL
  );

  console.log("Presentation updated successfully");
}
/*
 the updatePresentation function updates the content of a presentation identified
 by presentationId by editing the title slide with the new proposalTitle.
*/
async function renamePresentation(presentationId, newTitle) {
  const key = JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS));

  const auth = new google.auth.GoogleAuth();
  const jwtClient = auth.fromJSON(key);
  jwtClient.scopes = SLIDES_SCOPE;

  await jwtClient.authorize();

  const drive = google.drive({ version: "v3", auth: jwtClient });

  const response = await drive.files.update({
    fileId: presentationId,
    resource: { name: newTitle },
    fields: "id, name",
  });

  console.log(
    `Renamed file with id: ${response.data.id} to: ${response.data.name}`
  );
}

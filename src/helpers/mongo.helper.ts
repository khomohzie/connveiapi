/**
 * Translate a Mongoose ValidatorError or a MongoDB duplicate-key error into a
 * human readable message. Mirrors the original `dbErrorHandler` helper.
 */

const uniqueMessage = (error: any): string => {
  let output: string;
  try {
    const fieldName = error.message.substring(
      error.message.lastIndexOf(".$") + 2,
      error.message.lastIndexOf("_1")
    );
    output =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + " already exists";
  } catch (ex) {
    output = "Unique field already exists";
  }

  return output;
};

export const errorHandler = (error: any): string => {
  let message = "";

  if (error?.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = "Something went wrong";
    }
  } else if (error?.errors) {
    for (const errorName in error.errors) {
      if (error.errors[errorName]?.message) {
        message = error.errors[errorName].message;
      }
    }
  } else {
    message = error?.message || "Something went wrong";
  }

  return message;
};

export default errorHandler;

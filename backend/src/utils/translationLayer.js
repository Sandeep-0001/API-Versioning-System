/**
 * Translates V1 User data (name) to V2 User data (firstName, lastName)
 * @param {Object} v1Body - The body of a V1 request
 * @returns {Object} v2Body - The body compatible with V2
 */
export const translateV1ToV2 = (v1Body) => {
  const { name, email } = v1Body;
  
  if (!name) {
    return { firstName: "", lastName: "", email };
  }

  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || ""; // Handle case with single name

  return {
    firstName,
    lastName,
    email
  };
};

export const translateV2ToV1 = (v2Body) => {
  const { firstName, lastName, email } = v2Body;
  return {
    name: `${firstName || ""} ${lastName || ""}`.trim(),
    email,
  };
};

export const translateV2ToV3 = (v2Body) => {
  const { firstName, lastName, email } = v2Body;
  return {
    firstName: firstName || "",
    lastName: lastName || "",
    fullName: `${firstName || ""} ${lastName || ""}`.trim(),
    email,
  };
};

export const translateV3ToV2 = (v3Body) => {
  const { firstName, lastName, fullName, email } = v3Body;
  if (firstName || lastName) {
    return {
      firstName: firstName || "",
      lastName: lastName || "",
      email,
    };
  }

  const nameParts = (fullName || "").trim().split(" ").filter(Boolean);
  return {
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    email,
  };
};

export const translateV1ToV3 = (v1Body) => translateV2ToV3(translateV1ToV2(v1Body));

export const translateV3ToV1 = (v3Body) => translateV2ToV1(translateV3ToV2(v3Body));

/**
 * Middleware adapter to use V2 controller for V1 route (Experimental/Optional)
 * This allows V1 endpoints to use V2 logic by translating the request first.
 */
export const v1ToV2Adapter = (req, res, next) => {
    if (req.body && req.body.name) {
        req.body = translateV1ToV2(req.body);
    }
    next();
};

export const v2ToV3Adapter = (req, res, next) => {
  if (req.body && (req.body.firstName || req.body.lastName)) {
    req.body = translateV2ToV3(req.body);
  }
  next();
};

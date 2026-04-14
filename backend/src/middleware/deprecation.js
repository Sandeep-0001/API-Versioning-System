export const buildDeprecationMiddleware = ({
  version,
  successor,
  deprecationDate,
  sunsetDate,
  hardBlockAfterSunset = false,
}) => {
  return (req, res, next) => {
    const now = new Date();
    const sunset = new Date(sunsetDate);

    res.set("Deprecation", "true");
    res.set("Sunset", sunset.toUTCString());
    res.set(
      "Warning",
      `299 - "API ${version} is deprecated. Migrate to ${successor} before ${sunset.toISOString()}"`,
    );
    res.set("X-Deprecation-Date", new Date(deprecationDate).toISOString());
    res.set("X-API-Successor-Version", successor);
    res.set("Link", `<${successor}>; rel="successor-version"`);

    if (hardBlockAfterSunset && now > sunset) {
      return res.status(410).json({
        success: false,
        error: `API ${version} has reached sunset and is no longer available`,
        successor,
      });
    }

    return next();
  };
};

const deprecationMiddleware = buildDeprecationMiddleware({
  version: "v1",
  successor: "/api/v2/users",
  deprecationDate: "2026-04-01T00:00:00.000Z",
  sunsetDate: "2026-12-31T00:00:00.000Z",
  hardBlockAfterSunset: false,
});

export default deprecationMiddleware;

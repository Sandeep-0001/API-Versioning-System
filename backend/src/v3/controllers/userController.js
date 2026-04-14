import User from "../models/User.js";
import {
  translateV1ToV3,
  translateV2ToV3,
} from "../../utils/translationLayer.js";

export const createUser = async (req, res) => {
  try {
    const { name, firstName, lastName, fullName, email, age, phone } = req.body;
    const normalizedAge =
      age === undefined || age === null || age === "" ? null : Number(age);
    const normalizedPhone = String(phone || "").trim();

    let userData;
    let sourceVersion = "v3";

    if (typeof name === "string" && name.trim()) {
      userData = translateV1ToV3({ name, email });
      sourceVersion = "v1";
    } else if (typeof firstName === "string" || typeof lastName === "string") {
      userData = translateV2ToV3({ firstName, lastName, email });
      sourceVersion = "v2";
    } else {
      const normalizedFullName = String(fullName || "").trim();
      const parts = normalizedFullName.split(" ").filter(Boolean);
      userData = {
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" "),
        fullName: normalizedFullName,
        email,
      };
    }

    if (normalizedAge !== null && Number.isFinite(normalizedAge)) {
      userData.age = normalizedAge;
    }
    userData.phone = normalizedPhone;

    const user = new User({ ...userData, sourceVersion });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
